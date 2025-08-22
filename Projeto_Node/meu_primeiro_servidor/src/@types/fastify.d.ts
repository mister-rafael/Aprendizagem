// src/@types/fastify.d.ts
import { db } from '../db/connection';

declare module 'fastify' {
  export interface FastifyInstance {
    db: typeof db;
  }
}