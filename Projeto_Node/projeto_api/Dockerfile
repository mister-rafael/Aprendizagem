# --- ESTÁGIO 1: Builder (A Oficina Pesada) ---
# Usamos uma imagem Node completa para instalar dependências e compilar o projeto.
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia os arquivos de definição de dependências.
COPY package*.json ./

# Instala TODAS as dependências (incluindo as de desenvolvimento, como o TypeScript).
RUN npm install

# Copia todo o resto do nosso código-fonte.
COPY . .

# Roda o script de build para compilar o TypeScript para JavaScript.
# O resultado estará na pasta /app/dist.
RUN npm run build

# --- ESTÁGIO 2: Production (O Carro de Corrida) ---
# Começamos com uma imagem Node limpa e muito menor, do zero.
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências novamente.
COPY package*.json ./

# Instala APENAS as dependências de PRODUÇÃO.
RUN npm install --omit=dev

# A MÁGICA: Copia APENAS a pasta 'dist' (com o código compilado) do estágio 'builder'.
COPY --from=builder /app/dist ./dist

# Expõe a porta que nossa aplicação usa, para fins de documentação e rede.
EXPOSE 3333

# O comando para iniciar a aplicação quando o contêiner rodar.
# Ele executa o JavaScript compilado.
CMD ["node", "dist/server.js"]