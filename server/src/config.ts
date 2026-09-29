import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is required.');
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
};
