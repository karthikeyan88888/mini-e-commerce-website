import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../prisma.js';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.js';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Valid email is required'),
  shippingAddress: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(2, 'Postal code is required'),
  country: z.string().optional().default('United States'),
});

export async function orderRoutes(fastify: FastifyInstance) {
  // Place Order (Checkout)
  fastify.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const parsed = checkoutSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parsed.error.format(),
        });
      }

      const { customerName, customerEmail, shippingAddress, city, postalCode, country } = parsed.data;

      // 1. Fetch user's cart
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        return reply.status(400).send({ error: 'Your cart is empty. Add products before placing an order.' });
      }

      // 2. Validate stock & recalculate prices on backend
      let subtotal = 0;
      const orderItemsToCreate: Array<{
        productId: string;
        quantity: number;
        priceAtPurchase: number;
      }> = [];

      for (const item of cart.items) {
        const product = item.product;
        if (!product || product.status !== 'ACTIVE') {
          return reply.status(400).send({
            error: `Product "${product?.name || 'Unknown'}" is no longer available. Please update your cart.`,
          });
        }

        if (product.stock < item.quantity) {
          return reply.status(400).send({
            error: `Insufficient stock for "${product.name}". Only ${product.stock} units available, but ${item.quantity} requested.`,
          });
        }

        subtotal += product.price * item.quantity;
        orderItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });
      }

      const tax = subtotal * 0.08;
      const shipping = subtotal > 150 ? 0 : 15;
      const totalAmount = Number((subtotal + tax + shipping).toFixed(2));

      // Generate a clean tracking number
      const trackingNumber = `NX-${Math.floor(100000 + Math.random() * 900000)}`;

      // 3. Atomic transaction: Create Order + OrderItems, reduce stock, clear cart
      const order = await prisma.$transaction(async (tx) => {
        // Create order
        const newOrder = await tx.order.create({
          data: {
            userId,
            totalAmount,
            status: 'PLACED',
            customerName,
            customerEmail,
            shippingAddress,
            city,
            postalCode,
            country,
            trackingNumber,
            items: {
              create: orderItemsToCreate,
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        // Decrement stock for each product
        for (const item of orderItemsToCreate) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Clear cart
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return newOrder;
      });

      return reply.status(201).send({
        message: 'Order placed successfully',
        order,
      });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to place order. Please try again.' });
    }
  });

  // Get My Orders
  fastify.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;

      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return reply.send({ orders });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to fetch orders' });
    }
  });

  // Get Order Details by ID or Tracking Number
  fastify.get<{ Params: { id: string } }>('/:id', { preHandler: [optionalAuthenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;

      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { id },
            { trackingNumber: id },
          ],
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' });
      }

      // If user is authenticated as customer and querying a private ID that belongs to another user
      if (
        request.user &&
        request.user.role !== 'ADMIN' &&
        order.userId !== request.user.id &&
        !id.toUpperCase().startsWith('NX-')
      ) {
        return reply.status(403).send({ error: 'Unauthorized to view this order' });
      }

      return reply.send({ order });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to fetch order details' });
    }
  });
}
