import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { UserService } from './user.service'

// Criamos uma instância do nosso service para que os handlers das rotas possam usá-la.
const userService = new UserService()

// Criamos uma função "plugin" do Fastify que registra todas as nossas rotas de usuário.
export async function userRoutes(app: FastifyInstance) {
  // ROTA 1: GET /users -> Buscar todos os usuários.
  app.get('/users', async () => {
    const users = await userService.getAll()
    return users
  })
  // ROTA 2: POST /users -> Criar um novo usuário.
  app.post('/users', async (request, reply) => {
    // 1. Validação com Zod: Definimos o "molde" dos dados que esperamos receber.
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email('Formato de e-mail inválido.'),
    })
    try {
      // 2. O .parse() do Zod valida o request.body. Se for inválido, ele joga um erro.
      const { name, email } = createUserBodySchema.parse(request.body)
      // 3. Se a validação passou, chamamos nosso Service.
      const newUser = await userService.create({ name, email })
      // 4. Retornamos o status 201 (Created) e o usuário criado.
      return reply.status(201).send(newUser)
    } catch (error) {
      // 1. Trata os erros de validação do Zod
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'Erro de validação',
          details: error.format(),
        })
      }
      // 2. Trata os erros de negócio do nosso Service
      if (error instanceof Error) {
        return reply.status(400).send({ message: error.message })
      }
      // 3. Trata qualquer outro erro inesperado
      return reply.status(500).send({ message: 'Um erro inesperado aconteceu.' })

    }
  })
}