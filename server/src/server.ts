import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { config } from './config.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { productRoutes } from './modules/products/products.routes.js';
import { cartRoutes } from './modules/cart/cart.routes.js';
import { orderRoutes } from './modules/orders/orders.routes.js';
import { inventoryRoutes } from './modules/inventory/inventory.routes.js';
import { adminRoutes } from './modules/admin/admin.routes.js';
import { supportRoutes } from './modules/support/support.routes.js';

const fastify = Fastify({
  logger: {
    level: 'info',
  },
});

async function main() {
  // CORS
  await fastify.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // JWT
  await fastify.register(jwt, {
    secret: config.jwtSecret,
  });

  // Health Check
  fastify.get('/api/health', async () => {
    return {
      status: 'healthy',
      system: 'NEXORO E-Commerce Core',
      timestamp: new Date().toISOString(),
    };
  });

  // Register Modules
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(productRoutes, { prefix: '/api/products' });
  await fastify.register(cartRoutes, { prefix: '/api/cart' });
  await fastify.register(orderRoutes, { prefix: '/api/orders' });
  await fastify.register(inventoryRoutes, { prefix: '/api/inventory' });
  await fastify.register(adminRoutes, { prefix: '/api/admin' });
  await fastify.register(supportRoutes, { prefix: '/api/support' });

  // Global Error Handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.status(error.statusCode || 500).send({
      error: error.name || 'InternalServerError',
      message: error.message || 'An unexpected error occurred on the server',
    });
  });

  try {
    const address = await fastify.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`\n==================================================`);
    console.log(`🚀 NEXORO Backend running at: ${address}`);
    console.log(`⚡ API Health Check: ${address}/api/health`);
    console.log(`==================================================\n`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
