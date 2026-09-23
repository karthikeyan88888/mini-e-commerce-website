import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const createTicketSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  orderNumber: z.string().optional(),
  category: z.enum([
    'Acoustic Calibration & Technical Inquiry',
    'Warranty & Hardware Repair Claim',
    'Order Dispatch & Courier Tracking',
    '30-Day Audition Return Request',
    'General Concierge Assistance',
  ]),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function supportRoutes(fastify: FastifyInstance) {
  // Submit Customer Care Ticket
  fastify.post('/ticket', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = createTicketSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          error: 'Validation failed',
          details: parsed.error.format(),
        });
      }

      const { name, email, orderNumber, category, message } = parsed.data;
      const ticketId = `NX-CARE-${Math.floor(100000 + Math.random() * 900000)}`;

      request.log.info({ ticketId, email, category }, 'Customer care ticket submitted');

      return reply.status(201).send({
        success: true,
        ticketId,
        message: 'Your inquiry has been allocated to a dedicated NEXORO acoustic specialist.',
        estimatedResponseTime: 'Under 2 hours',
        ticket: {
          id: ticketId,
          name,
          email,
          orderNumber: orderNumber || 'N/A',
          category,
          status: 'RECEIVED',
          createdAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ error: 'Failed to submit customer care ticket' });
    }
  });

  // Get Care Status / Direct Channels
  fastify.get('/status', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      status: 'OPERATIONAL',
      globalConciergeStatus: 'ONLINE_24_7',
      channels: {
        email: 'concierge@nexoro.io',
        phone: '+1 (800) 840-6396',
        hours: '24 Hours / 7 Days a Week',
        hubs: ['San Francisco, CA', 'Tokyo, Japan', 'Berlin, Germany'],
      },
    });
  });
}
