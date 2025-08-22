import 'dotenv/config' // Garante que as variáveis de ambiente sejam carregadas
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Pega a URL de conexão do nosso arquivo .env
const connectionString = process.env.DATABASE_URL!

// Cria o cliente de conexão "bruto" com o banco.
// É o "motorista" que sabe como estabelecer a comunicação.
const client = postgres(connectionString)

// Agora, criamos a instância principal do Drizzle (nosso "tradutor-chefe").
// Passamos para ele o "motorista" (client) e a "planta" (schema).
export const db = drizzle(client, { schema })