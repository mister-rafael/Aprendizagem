// src/server.ts

// Importa o framework Fastify.
// A sintaxe 'import ... from ...' é do TypeScript/ESModules.
import Fastify from 'fastify';

// Cria uma instância do Fastify.
// A constante 'app' representa nosso servidor.
const app = Fastify({
  // O logger é um registrador de eventos.
  // Ativá-lo (true) nos ajuda a ver o que está acontecendo no servidor,
  // como requisições chegando e erros.
  logger: true,
});

// Define uma rota. Uma rota é um "caminho" no nosso servidor que responde
// a uma requisição.
// Neste caso, estamos criando uma rota para o método GET na URL raiz ('/').
app.get('/', async (request, reply) => {
  // 'request' contém as informações da requisição (quem pediu, de onde, etc).
  // 'reply' é usado para enviar a resposta de volta ao cliente.
  return { hello: 'world' };
});

// Função principal para iniciar o servidor.
// Usamos async/await para lidar com a natureza assíncrona do Node.js.
const start = async () => {
  try {
    // Inicia o servidor para "ouvir" requisições na porta 3333.
    // A porta é como um apartamento em um prédio: o endereço IP é o prédio,
    // e a porta é o número do apartamento para onde a "carta" (requisição) deve ir.
    await app.listen({ port: 3333 });
  } catch (err) {
    // Se ocorrer um erro ao iniciar o servidor (ex: a porta já está em uso),
    // o logger registrará o erro e o processo será encerrado.
    app.log.error(err);
    process.exit(1);
  }
};

// Chama a função para iniciar o servidor.
start();