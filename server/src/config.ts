import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET || 'nexoro_default_jwt_secret_key_2026',
  nodeEnv: process.env.NODE_ENV || 'development',
};
