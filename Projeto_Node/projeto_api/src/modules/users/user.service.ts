import { db } from '../../db' // Importa nosso "tradutor-chefe"
import { users } from '../../db/schema' // Importa a "planta" da tabela
import { eq } from 'drizzle-orm' // Uma ferramenta do Drizzle para criar condições (ex: WHERE email = '...')

// DTO (Data Transfer Object) - É uma boa prática criar um "molde"
// para os dados que esperamos receber em nossas funções.
type CreateUserDTO = {
  name: string
  email: string
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
}