import { defineConfig } from 'drizzle-kit'
import 'dotenv/config' // Importa o dotenv para carregar as variáveis de ambiente

export default defineConfig({
  schema: './src/db/schema.ts', // Onde está nossa "planta"
  out: './static/migrations', // Pasta onde os arquivos de migração serão gerados
  dialect: 'postgresql', // O "dialeto" do banco que estamos usando. Ou seja, qual lingua falar.
  dbCredentials: {
    // As credenciais para o Drizzle Kit se conectar ao banco.
    // Ele vai pegar a URL do nosso arquivo .env!
    url: process.env.DATABASE_URL!,
  },
})