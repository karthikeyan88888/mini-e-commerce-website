import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../prisma.js';
import { requireAdmin } from '../../middleware/auth.js';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(2, 'Category is required'),
  price: z.number().positive('Price must be greater than zero'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  rating: z.number().min(1).max(5).optional().default(4.9),
  specs: z.string().optional(),
});

export async function productRoutes(fastify: FastifyInstance) {
  // List Products
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as {
        category?: string;
        search?: string;
        sort?: string;
        stockStatus?: string;
        includeInactive?: string;
      };

      const where: any = {};

      if (query.includeInactive !== 'true') {
        where.status = 'ACTIVE';
      }

      if (query.category && query.category.toUpperCase() !== 'ALL') {
        where.category = query.category.toUpperCase();
      }

      if (query.search && query.search.trim() !== '') {
        const term = query.search.trim();
        where.OR = [
          { name: { contains: term } },
          { description: { contains: term } },
          { category: { contains: term } },
          { sku: { contains: term } },
        ];
      }

      if (query.stockStatus === 'inStock') {
        where.stock = { gt: 5 };
      } else if (query.stockStatus === 'lowStock') {
        where.stock = { gt: 0, lte: 5 };
      } else if (query.stockStatus === 'outOfStock') {
        where.stock = 0;
      }

      let orderBy: any = { createdAt: 'desc' };
      if (query.sort === 'price-asc') {
        orderBy = { price: 'asc' };
      } else if (query.sort === 'price-desc') {
        orderBy = { price: 'desc' };
      } else if (query.sort === 'name-asc') {
        orderBy = { name: 'asc' };
      } else if (query.sort === 'rating-desc') {
        orderBy = { rating: 'desc' };
      }

      const products = await prisma.product.findMany({
        where,
        orderBy,
      });

      // Categories summary
      const categories = await prisma.product.findMany({
        where: { status: 'ACTIVE' },
        select: { category: true },
        distinct: ['category'],
      });

      return reply.send({
        products,
        total: products.length,
        categories: categories.map((c) => c.category),
      });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to fetch products' });
    }
  });

  // Get Single Product
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return reply.status(404).send({ error: 'Product not found' });
      }

      // Fetch related products from same category
      const related = await prisma.product.findMany({
        where: {
          category: product.category,
          id: { not: product.id },
          status: 'ACTIVE',
        },
        take: 3,
      });

      return reply.send({ product, related });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to fetch product details' });
    }
  });

  // Create Product (Admin Only)
  fastify.post('/', { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = productSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parsed.error.format(),
        });
      }

      const existingSku = await prisma.product.findUnique({
        where: { sku: parsed.data.sku },
      });

      if (existingSku) {
        return reply.status(409).send({ error: 'Product with this SKU already exists' });
      }

      const product = await prisma.product.create({
        data: parsed.data,
      });

      return reply.status(201).send({ message: 'Product created successfully', product });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to create product' });
    }
  });

  // Update Product (Admin Only)
  fastify.put<{ Params: { id: string } }>('/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const parsed = productSchema.partial().safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parsed.error.format(),
        });
      }

      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) {
        return reply.status(404).send({ error: 'Product not found' });
      }

      if (parsed.data.sku && parsed.data.sku !== existing.sku) {
        const skuConflict = await prisma.product.findUnique({
          where: { sku: parsed.data.sku },
        });
        if (skuConflict) {
          return reply.status(409).send({ error: 'Another product with this SKU already exists' });
        }
      }

      const updated = await prisma.product.update({
        where: { id },
        data: parsed.data,
      });

      return reply.send({ message: 'Product updated successfully', product: updated });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to update product' });
    }
  });

  // Safe Delete / Deactivate Product (Admin Only)
  fastify.delete<{ Params: { id: string } }>('/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      const { id } = request.params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          orderItems: true,
        },
      });

      if (!product) {
        return reply.status(404).send({ error: 'Product not found' });
      }

      // If product has been ordered in historical orders, mark INACTIVE to preserve records
      if (product.orderItems.length > 0) {
        const deactivated = await prisma.product.update({
          where: { id },
          data: { status: 'INACTIVE' },
        });

        return reply.send({
          message: 'Product is referenced in previous orders. Safely marked as INACTIVE to preserve order history.',
          product: deactivated,
          deactivated: true,
        });
      }

      // If no orders, hard delete
      await prisma.cartItem.deleteMany({ where: { productId: id } });
      await prisma.product.delete({ where: { id } });

      return reply.send({ message: 'Product removed from catalogue permanently', deleted: true });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to delete product' });
    }
  });
}
