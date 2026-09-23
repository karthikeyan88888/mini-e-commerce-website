import { FastifyReply, FastifyRequest } from 'fastify';

export interface JwtUserPayload {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  name: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtUserPayload;
    user: JwtUserPayload;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing or malformed Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = await request.jwtVerify<JwtUserPayload>();
    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid or expired token' });
  }
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  await authenticate(request, reply);
  if (reply.sent) return;

  if (request.user?.role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Forbidden: Admin access required' });
  }
}

export async function optionalAuthenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const decoded = await request.jwtVerify<JwtUserPayload>();
      request.user = decoded;
    }
  } catch (err) {
    // optional, do not throw
  }
}
