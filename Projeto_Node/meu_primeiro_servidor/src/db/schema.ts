// src/db/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Definindo a tabela 'users'
export const users = pgTable('users', {
  // Coluna 'id': tipo serial (inteiro auto-incrementável) e chave primária
  id: serial('id').primaryKey(),
  
  // Coluna 'name': tipo texto, não pode ser nula
  name: text('name').notNull(),
  
  // Coluna 'email': tipo texto, não pode ser nula e deve ser única
  email: text('email').notNull().unique(),
  
  // Coluna 'createdAt': tipo timestamp, com valor padrão para a data/hora atual
  createdAt: timestamp('created_at').defaultNow().notNull(),
});