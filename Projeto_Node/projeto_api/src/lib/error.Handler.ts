import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply,
) {
    // 1. Trata os erros de validação do Zod
    if (error instanceof z.ZodError) {
        return reply.status(400).send({
            message: 'Erro de validação',
            details: error.format(),
        })
    }

    // 2. Trata os erros de negócio do nosso Service
    if (error instanceof Error) {
        // No futuro, aqui poderíamos logar o erro em uma ferramenta externa
        console.error(error) // É uma boa prática logar o erro no servidor
        return reply.status(400).send({ message: error.message })
    }

    // 3. Trata qualquer outro erro inesperado
    return reply.status(500).send({ message: 'Um erro inesperado aconteceu.' })
}