// Importa o framework Fastify.
// A sintaxe 'import ... from ...' é do TypeScript/ESModules.
import Fastify from 'fastify';
// Importe e configure o dotenv NO TOPO DO ARQUIVO
import 'dotenv/config';
// Importa os plugins criados
import { AppError } from './errors/AppError';
import { helloRoutes } from './routes/hello';
import { users } from './routes/users';

// Cria uma instância do Fastify.
// A constante 'app' representa nosso servidor.
const app = Fastify({
  // O logger é um registrador de eventos.
  // Ativá-lo (true) nos ajuda a ver o que está acontecendo no servidor,
  // como requisições chegando e erros.
  logger: true,
});

// Registra o manipulador de erros
app.setErrorHandler((error, request, reply) => {
  // Se o erro for um que nós criamos (um erro esperado)...
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message,
    });
  }
  // Para erros inesperados (bugs, erros de sistema)...
  // É importante logar o erro para podermos depurar.
  app.log.error(error);

  // E enviar uma resposta genérica para não expor detalhes do sistema.
  return reply.status(500).send({
    status: 'error',
    message: 'Internal server error.',
  });
});

// O método .register() é como "encaixamos" a nossa caixa de Lego.
app.register(helloRoutes, { prefix: '/api/v1' });
app.register(users, { prefix: '/api/v2' });

// Função principal para iniciar o servidor.
// Usa-se async/await para lidar com a natureza assíncrona do Node.js.
const start = async () => {
  try {
    // O 'process.env' é o objeto global do Node.js que guarda as variáveis.
    // Usamos 'Number()' para converter o texto '3333' para o tipo número.
    const port = Number(process.env.PORT);
    // Inicia o servidor para "ouvir" requisições na porta 3333.
    // A porta é como um apartamento em um prédio: o endereço IP é o prédio,
    // e a porta é o número do apartamento para onde a "carta" (requisição) deve ir.
    await app.listen({ port });
  } catch (err) {
    // Se ocorrer um erro ao iniciar o servidor (ex: a porta já está em uso),
    // o logger registrará o erro e o processo será encerrado.
    app.log.error(err);
    process.exit(1);
  }
};
// Chama a função para iniciar o servidor.
start();