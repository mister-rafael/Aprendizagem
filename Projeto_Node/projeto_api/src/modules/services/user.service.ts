import { db } from '../../db' // Importa nosso "tradutor-chefe"
import { users } from '../../db/schema' // Importa a "planta" da tabela
import { eq } from 'drizzle-orm' // Uma ferramenta do Drizzle para criar condições (ex: WHERE email = '...')
import { CreateUserDTO, UpdateUserDTO } from '../routes/user.controller' // Importação do DTO (Data Transfer Object)
import { UserRepository } from '../repository/user.repository'
// Regras de negócios para os usuário.
export class UserService {
  // O Service agora DEPENDE de um repositório.
  // Isso se chama Injeção de Dependência.
  constructor(private userRepository: UserRepository) {}

  // --- CONSULTA - Método para BUSCAR todos os usuários ---
  async getAll() {
    // Delega a tarefa para o repositório
    const allUsers = await this.userRepository.findAll()
    return allUsers
  }
  // --- CREATE - Método para CRIAR um novo usuário ---
  async create(data: CreateUserDTO) {
    // 1. LÓGICA DE NEGÓCIO: Verificar se o e-mail já existe.
    // Quem faz é o repositório
    const existingUser = await this.userRepository.findByEmail(data.email)
  
    // Aciona o alarme de erro para que o tratador global atue.
    if (existingUser) {
      throw new Error('Este e-mail já está em uso.')
    }
    // 2. AÇÃO NO BANCO: Inserir o novo usuário.
    // Delega a tarefa de salvar para o repositório
    const newUser = await this.userRepository.create(data)
    return newUser
  }
  // --- UPDATE - Método para ATUALIZAR um usuário ---
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
  // --- DELETE - Método para DELETAR um usuário ---
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
  // Vai deletar da tabela "users" o registro cujo id é iguala ao id passado como parâmetro.
    await db.delete(users).where(eq(users.id, id))

    return { message: 'Usuário deletado com sucesso.' }
  }
}