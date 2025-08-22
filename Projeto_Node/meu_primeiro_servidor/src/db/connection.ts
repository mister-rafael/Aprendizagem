// src/db/connection.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Cria o cliente de conexão
export const client = postgres(process.env.DATABASE_URL);

// Cria a instância do Drizzle, passando o cliente e o schema
export const db = drizzle(client, { schema });