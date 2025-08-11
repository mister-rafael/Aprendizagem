import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
// Importe o AppError aqui também
import { AppError } from '../errors/AppError';

// A função do plugin de rotas precisa ser assíncrona (async)
// Ela recebe a instância do Fastify (que chamamos de 'app' aqui)
// como primeiro argumento.
export async function helloRoutes(app: FastifyInstance) {
    // Define uma rota. Uma rota é um "caminho" no nosso servidor que responde
    // a uma requisição.
    // Neste caso, estamos criando uma rota para o método GET na URL raiz ('/').
    app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        return { message: 'Esta rota veio do nosso plugin!' };
    });
    // Podemos adicionar quantas rotas quisermos neste mesmo arquivo.
    // Exemplo: uma nova rota /hello
    app.get('/hello', async (request: FastifyRequest, reply: FastifyReply) => {
        return { message: 'Olá, mundo, diretamente do plugin!' };
    });
    // Exemplo: uma rota com parâmetros
    // Acesse no navegador: http://localhost:3333/hello/seu-nome
    app.get('/hello/:name', async (request: FastifyRequest, reply: FastifyReply) => {
        // Para pegar o parâmetro da URL, usamos 'request.params'
        // Precisamos dizer ao TypeScript o formato esperado dos parâmetros.
        const { name } = request.params as { name: string };

        return { Mensagem: `Olá, ${name}! Seja bem - Vindo (a)` };
    });
    // Nova rota para testar erros
    app.get('/test-error', async (request, reply) => {
        // Aqui simulamos uma condição de erro.
        // Em uma aplicação real, isso poderia ser "usuário não encontrado",
        // "produto sem estoque", etc.
        throw new AppError('Ops, algo deu errado de propósito!', 401);
    });

}