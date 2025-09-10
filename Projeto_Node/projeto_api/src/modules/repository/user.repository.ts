// src/modules/users/user.repository.ts
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { CreateUserDTO } from '../routes/user.controller' // Assumindo que o DTO e schema estão no controller

export class UserRepository {
  async findByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    return user
  }

  async findAll() {
    // A mágica do Drizzle: é quase como ler uma frase em inglês.
    // "Banco de dados, selecione tudo da tabela de usuários."
    const allUsers = await db.select().from(users)
    return allUsers
  }

  async create(data: CreateUserDTO) {
    const newUser = await db.insert(users).values(data).returning()
    return newUser[0]
  }

  // Os métodos de update e delete também viriam para cá
}