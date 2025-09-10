import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { UserService } from '../services/user.service'
import { UserRepository } from '../repository/user.repository'
import { request } from 'http'
import { REPL_MODE_SLOPPY } from 'repl'

// 1. Criamos o "Chefe de Estoque"
const userRepository = new UserRepository()
// 2. Criamos o "Chef de Cozinha" e entregamos a ele o contato do Chefe de Estoque
const userService = new UserService(userRepository)
// 3. Definimos o schema do Zod como a FONTE ÚNICA DA VERDADE, fora das rotas.
export const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email('Formato de e-mail inválido.'),
});
export const updateUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Formato de e-mail inválido.').optional(),
});
// 2.1. Usamos o Zod para INFERIR (deduzir) o tipo TypeScript a partir do schema, para os services.
export type CreateUserDTO = z.infer<typeof createUserBodySchema>;
export type UpdateUserDTO = z.infer<typeof updateUserBodySchema>;

//3. Criamos uma função "plugin" do Fastify que registra todas as nossas rotas de usuário.
export async function userRoutes(app: FastifyInstance) {
  // ROTA 1: GET /users -> Buscar todos os usuários.
  app.get('/users', async () => {
    const users = await userService.getAll()
    return users
  })
  // ROTA 2: POST /users -> Criar um novo usuário.
  app.post('/users', async (request, reply) => {
    // 2. O .parse() do Zod valida o request.body. Se for inválido, ele joga um erro.
    const validatedData = createUserBodySchema.parse(request.body)
    // 3. Se a validação passou, chamamos nosso Service.
    const newUser = await userService.create(validatedData)
    // 4. Retornamos o status 201 (Created) e o usuário criado.
    return reply.status(201).send(newUser)
  })
  // ROTA 3: PUT /users/:id -> Atualizar um usuário.
  app.put('/users/:id', async (request, reply) => {
    // 1. Validação do corpo (o que pode ser atualizado)
    // 2. Validação dos parâmetros da rota (o ID)
    const paramsSchema = z.object({
      id: z.coerce.number(), // coerce força a conversão para número
    })
    // 3. O .parse() do Zod valida o request.params. Se for inválido, ele joga um erro.
    const { id } = paramsSchema.parse(request.params)
    // 4. O .parse() do Zod valida o request.body. Se for inválido, ele joga um erro.
    const data = updateUserBodySchema.parse(request.body)
    // 5. Se a validação passou, chamamos nosso Service.
    const updatedUser = await userService.update(id, data)
    // 6. Retornamos o status 201 (Updated) e o usuário atualizado.
    return reply.send(updatedUser)
  })
  // ROTA 4: DELETE /users/:id -> Deletar um usuário.
  app.delete('/users/:id', async (request, reply) => {
    // 1. Validação dos parâmetros da rota
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })
    const { id } = paramsSchema.parse(request.params)
    const result = await userService.delete(id)
    return reply.send(result)
  })
}