import { db } from '../../db' // Importa nosso "tradutor-chefe"
import { users } from '../../db/schema' // Importa a "planta" da tabela
import { eq } from 'drizzle-orm' // Uma ferramenta do Drizzle para criar condições (ex: WHERE email = '...')

// DTO (Data Transfer Object) - É uma boa prática criar um "molde"
// para os dados que esperamos receber em nossas funções.
type CreateUserDTO = {
  name: string
  email: string
}
type UpdateUserDTO = {
  name?: string // O '?' torna os campos opcionais
  email?: string
}

export class UserService {
  // --- Método para buscar todos os usuários ---
  async getAll() {
    // A mágica do Drizzle: é quase como ler uma frase em inglês.
    // "Banco de dados, selecione tudo da tabela de usuários."
    const allUsers = await db.select().from(users)
    return allUsers
  }
  // --- Método para criar um novo usuário ---
  async create(data: CreateUserDTO) {
    // 1. LÓGICA DE NEGÓCIO: Verificar se o e-mail já existe.
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    })

    if (existingUser) {
      throw new Error('Este e-mail já está em uso.')
    }

    // 2. AÇÃO NO BANCO: Inserir o novo usuário.
    const newUser = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        // Os campos createdAt e updatedAt serão preenchidos automaticamente
        // pelo banco, graças ao `defaultNow()` que definimos no schema.
      })
      .returning() // Pede para o banco retornar o registro que acabou de ser criado.

    // .returning() sempre devolve um array, então pegamos o primeiro elemento.
    return newUser[0]
  }
  // --- Método para atualizar um usuário ---
  async update(id: number, data: UpdateUserDTO) {
    // 1. LÓGICA DE NEGÓCIO: Verificar se o usuário existe antes de atualizar.
    const userToUpdate = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    // Lança uma mensagem de erro, se o usuário não for encontrado na base
    if (!userToUpdate) {
      throw new Error('Usuário não encontrado.')
    }
    // 2. AÇÃO NO BANCO: Atualizar o usuário.
    const updateUser = await db
      .update(users) // Comando sql que informa qual a tabela que iremos atualizar
      .set({
        //valores para atualizar
        ...data, // Usa os dados recebidos para o update
        updatedAt: new Date(), // Atualiza a data de modificação
      })
      .where(eq(users.id, id)) // Especifica QUAL usuário atualizar
      .returning()
    return updateUser[0]
  }
  // --- Método para deletar um usuário ---
  async delete(id: number) {
    // 1. LÓGICA DE NEGÓCIO: Verificar se o usuário existe antes de deletar.
    const userToDelete = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    // Lança uma mensagem de erro, se o usuário não for encontrado na base
    if (!userToDelete) {
      throw new Error('Usuário não encontrado.')
    }
    // 2. AÇÃO NO BANCO: Deletar o usuário.
    await db.delete(users).where(eq(users.id, id))

    return { message: 'Usuário deletado com sucesso.' }
  }
}