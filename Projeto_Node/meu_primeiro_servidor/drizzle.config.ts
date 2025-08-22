// drizzle.config.ts
import 'dotenv/config';
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

export default {
  // Dialeto do banco de dados (neste caso, PostgreSQL)
  dialect: 'postgresql',
  // Onde os arquivos de migração serão salvos
  out: './src/db/migrations',
  // Onde o Drizzle vai procurar pelos arquivos de schema
  schema: './src/db/schema.ts',
  dbCredentials: {
    // A URL de conexão com o banco de dados. Vamos criá-la no .env
    url: process.env.DATABASE_URL!,
  },
  // Habilita o modo verbose para vermos mais detalhes no terminal
  verbose: true,
  // Garante que o Drizzle sempre trate os erros de forma estrita
  strict: true,
} satisfies Config;