import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../prisma.js';
import { requireAdmin } from '../../middleware/auth.js';

const stockUpdateSchema = z.object({
  stock: z.number().int().min(0, 'Stock cannot be negative'),
});

export async function inventoryRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireAdmin);

  // List all products with inventory status
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as {
        status?: string; // 'all' | 'low' | 'out' | 'in'
        search?: string;
        category?: string;
      };

      const where: any = {};

      if (query.status === 'low') {
        where.stock = { gt: 0, lte: 5 };
      } else if (query.status === 'out') {
        where.stock = 0;
      } else if (query.status === 'in') {
        where.stock = { gt: 5 };
      }

      if (query.category && query.category !== 'All') {
        where.category = query.category;
      }

      if (query.search && query.search.trim() !== '') {
        const term = query.search.trim();
        where.OR = [
          { name: { contains: term } },
          { sku: { contains: term } },
          { category: { contains: term } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        orderBy: { stock: 'asc' }, // show lowest stock first by default
      });

      // Quick summary metrics
      const totalProducts = await prisma.product.count();
      const lowStockCount = await prisma.product.count({
        where: { stock: { gt: 0, lte: 5 } },
      });
      const outOfStockCount = await prisma.product.count({
        where: { stock: 0 },
      });
      const inStockCount = await prisma.product.count({
        where: { stock: { gt: 5 } },
      });

      return reply.send({
        products,
        metrics: {
          totalProducts,
          lowStockCount,
          outOfStockCount,
          inStockCount,
        },
      });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to fetch inventory data' });
    }
  });

  // Quick Stock Update
  fastify.patch('/:id/stock', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const parsed = stockUpdateSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parsed.error.format(),
        });
      }

      const updated = await prisma.product.update({
        where: { id },
        data: { stock: parsed.data.stock },
      });

      return reply.send({ message: 'Stock updated successfully', product: updated });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to update stock' });
    }
  });
}
