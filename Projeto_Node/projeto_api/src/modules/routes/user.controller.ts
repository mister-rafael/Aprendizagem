import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { UserService } from '../services/user.service'
import { request } from 'http'
import { REPL_MODE_SLOPPY } from 'repl'

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
  // ROTA 3: PUT /users/:id -> Atualizar um usuário.
  app.put('/users/:id', async (request, reply) => {
    // 1. Validação do corpo (o que pode ser atualizado)
    const updateUserBodySchema = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
    })
    // 2. Validação dos parâmetros da rota (o ID)
    const paramsSchema = z.object({
      id: z.coerce.number(), // coerce força a conversão para número
    })

    try {
      // 3. O .parse() do Zod valida o request.params. Se for inválido, ele joga um erro.
      const { id } = paramsSchema.parse(request.params)
      // 4. O .parse() do Zod valida o request.body. Se for inválido, ele joga um erro.
      const data = updateUserBodySchema.parse(request.body)
      // 5. Se a validação passou, chamamos nosso Service.
      const updatedUser = await userService.update(id, data)
      // 6. Retornamos o status 201 (Updated) e o usuário atualizado.
      return reply.send(updatedUser)

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
  // ROTA 4: DELETE /users/:id -> Deletar um usuário.
}