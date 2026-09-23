import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../prisma.js';
import { authenticate } from '../../middleware/auth.js';

const addItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

export async function cartRoutes(fastify: FastifyInstance) {
  // All cart endpoints require user authentication
  fastify.addHook('preHandler', authenticate);

  // Get user cart with calculated totals
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;

      let cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });
      }

      // Calculate totals
      let subtotal = 0;
      let totalItems = 0;

      const itemsWithCalculations = cart.items.map((item) => {
        const itemTotal = (item.product?.price || 0) * item.quantity;
        subtotal += itemTotal;
        totalItems += item.quantity;
        return {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product: item.product,
          itemTotal,
          isAvailable: (item.product?.stock || 0) >= item.quantity && item.product?.status === 'ACTIVE',
        };
      });

      const tax = subtotal * 0.08; // 8% standard tax
      const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15; // Free shipping over $150
      const total = subtotal + tax + shipping;

      return reply.send({
        cart: {
          id: cart.id,
          userId: cart.userId,
          items: itemsWithCalculations,
          itemCount: totalItems,
          subtotal: Number(subtotal.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          total: Number(total.toFixed(2)),
        },
      });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to retrieve cart' });
    }
  });

  // Add Item to Cart
  fastify.post('/items', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const parsed = addItemSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parsed.error.format(),
        });
      }

      const { productId, quantity } = parsed.data;

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product || product.status !== 'ACTIVE') {
        return reply.status(404).send({ error: 'Product not found or is currently unavailable' });
      }

      if (product.stock <= 0) {
        return reply.status(400).send({ error: 'Product is out of stock' });
      }

      let cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
        });
      }

      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      const targetQuantity = (existingCartItem?.quantity || 0) + quantity;

      if (targetQuantity > product.stock) {
        return reply.status(400).send({
          error: `Cannot add ${quantity} more. Only ${product.stock} items available in stock (you have ${existingCartItem?.quantity || 0} in cart).`,
        });
      }

      if (existingCartItem) {
        await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: targetQuantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }

      return reply.status(201).send({ message: 'Product added to cart' });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to add item to cart' });
    }
  });

  // Update Item Quantity
  fastify.put('/items/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const parsed = updateItemSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parsed.error.format(),
        });
      }

      const { quantity } = parsed.data;

      const cartItem = await prisma.cartItem.findUnique({
        where: { id },
        include: { product: true },
      });

      if (!cartItem) {
        return reply.status(404).send({ error: 'Cart item not found' });
      }

      if (quantity <= 0) {
        await prisma.cartItem.delete({ where: { id } });
        return reply.send({ message: 'Item removed from cart' });
      }

      if (cartItem.product && quantity > cartItem.product.stock) {
        return reply.status(400).send({
          error: `Requested quantity exceeds available stock (${cartItem.product.stock} in stock)`,
        });
      }

      const updated = await prisma.cartItem.update({
        where: { id },
        data: { quantity },
      });

      return reply.send({ message: 'Cart updated', item: updated });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to update cart item' });
    }
  });

  // Remove Item
  fastify.delete('/items/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;

      await prisma.cartItem.delete({
        where: { id },
      });

      return reply.send({ message: 'Item removed from cart' });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to remove item' });
    }
  });

  // Clear Cart
  fastify.delete('/clear', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
      return reply.send({ message: 'Cart cleared' });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to clear cart' });
    }
  });
}
