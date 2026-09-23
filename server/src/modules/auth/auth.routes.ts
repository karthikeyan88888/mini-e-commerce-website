import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../../prisma.js';
import { authenticate } from '../../middleware/auth.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'ADMIN']).optional().default('CUSTOMER'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = registerSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parsed.error.format(),
        });
      }

      const { name, email, password, role } = parsed.data;

      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return reply.status(409).send({ error: 'A user with this email already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          role,
          cart: {
            create: {},
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role as 'CUSTOMER' | 'ADMIN',
        name: user.name,
      });

      return reply.status(201).send({
        message: 'Registration successful',
        token,
        user,
      });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Internal server error during registration' });
    }
  });

  // Login
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = loginSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parsed.error.format(),
        });
      }

      const { email, password } = parsed.data;

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          cart: {
            include: {
              items: true,
            },
          },
        },
      });

      if (!user) {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }

      // Ensure user has a cart
      if (!user.cart) {
        await prisma.cart.create({
          data: { userId: user.id },
        });
      }

      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role as 'CUSTOMER' | 'ADMIN',
        name: user.name,
      });

      return reply.send({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Internal server error during login' });
    }
  });

  // Current User (Me)
  fastify.get('/me', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          cart: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.send({ user });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to retrieve profile' });
    }
  });
}
