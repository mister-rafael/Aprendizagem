// Ponto de entrada da Aplicação.
import 'dotenv/config' // <-- ESSA DEVE SER A PRIMEIRA LINHA DO ARQUIVO
import fastify from "fastify"
import { userRoutes } from './modules/users/user.controller' // 1. Importar as rotas

const app = fastify({
    logger: true, // Liga o logger para vermos as requisições no terminal
})

app.register(userRoutes) // 2. Registrar o "plugin" de rotas

// PRECISO SABER COMO ESSA FUNÇÃO FUNCIONA REALMENTE...
const start = async () => {
    try {
        await app.listen({
            host: '0.0.0.0', // Importante para rodar dentro de um contêiner Docker no futuro
            port: 3333
        })
    } catch (err){
        app.log.error(err)
        process.exit(1)
    }
}
start()