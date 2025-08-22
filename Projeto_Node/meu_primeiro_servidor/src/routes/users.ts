import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';


export async function usersRoutes(app: FastifyInstance) {
  
  // ROTA 1: CREATE (Criar um novo usuário)
  app.post('/users', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
    });

    const { name, email } = createUserSchema.parse(request.body);

    const [newUser] = await app.db
      .insert(users)
      .values({ name, email })
      .returning();

    return reply.status(201).send(newUser);
  });

  // ROTA 2: READ (Listar todos os usuários)
  app.get('/users', async (request, reply) => {
    const allUsers = await app.db.select().from(users);
    return allUsers;
  });

  // ROTA 3: READ (Buscar um usuário específico por ID)
  app.get('/users/:id', async (request, reply) => {
    const getUserParams = z.object({
      id: z.coerce.number().int(),
    });
    const { id } = getUserParams.parse(request.params);

    const [user] = await app.db.select().from(users).where(eq(users.id, id));

    if (!user) {
      return reply.status(404).send({ message: 'User not found.' });
    }
    return user;
  });

  // ROTA 4: UPDATE (Atualizar um usuário)
  app.put('/users/:id', async (request, reply) => {
    const getUserParams = z.object({ id: z.coerce.number().int() });
    const updateUserBody = z.object({
      name: z.string().min(3).optional(),
      email: z.string().email().optional(),
    });

    const { id } = getUserParams.parse(request.params);
    const { name, email } = updateUserBody.parse(request.body);

    const [updatedUser] = await app.db
      .update(users)
      .set({ name, email })
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      return reply.status(404).send({ message: 'User not found.' });
    }
    return updatedUser;
  });

  // ROTA 5: DELETE (Remover um usuário)
  app.delete('/users/:id', async (request, reply) => {
    const getUserParams = z.object({ id: z.coerce.number().int() });
    const { id } = getUserParams.parse(request.params);

    const [deletedUser] = await app.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!deletedUser) {
      return reply.status(404).send({ message: 'User not found.' });
    }
    return reply.status(204).send();
  });
}