// O schema é a definição das tabelas em formato de código TypeScript. É a "planta baixa".
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core'
// Importar aqui as rotas criadas na pasta /src/modules/routes.


// Aqui estamos definindo a "planta" da nossa tabela de usuários
export const users = pgTable('users', {
    // Uma coluna 'id' do tipo número, que se auto-incrementa e é a chave primária.
    id: serial('id').primaryKey(),
    // Uma coluna 'name' do tipo texto (com no máximo 256 caracteres).
    name: varchar('name', { length: 256 }).notNull(),
    // Uma coluna 'email' do tipo texto, que deve ser única para cada registro.
    email: varchar('email', { length: 256 }).notNull().unique(),
    // Colunas para sabermos quando o registro foi criado e atualizado.
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
// Com isso, foi dito ao Drizzle como a tabela users deve ser.