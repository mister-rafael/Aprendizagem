import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function users(app: FastifyInstance) {
    app.get('/:name', async (request: FastifyRequest, reply: FastifyReply) => {
        const { name } = request.params as { name: string };

        return { message: `Olá, ${name}!` };
    });
}