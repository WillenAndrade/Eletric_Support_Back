FROM node:16-alpine

# Definir o diretório de trabalho
WORKDIR /app

# Instalar o bash (que é necessário para o script wait-for-it.sh)
RUN apk add --no-cache bash

# Copiar os arquivos package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instalar as dependências globais
RUN npm install -g nodemon

# Instalar as dependências do projeto (incluindo dependências de desenvolvimento)
RUN npm install --include=dev

# Copiar o restante dos arquivos para o contêiner
COPY . .

# Copiar o script wait-for-it.sh para o contêiner
COPY wait-for-it.sh /wait-for-it.sh

# Tornar o script executável
RUN chmod +x /wait-for-it.sh

# Expor a porta que o servidor irá usar
EXPOSE 3000

# Usar o wait-for-it.sh para esperar o MySQL estar pronto, antes de iniciar o servidor
CMD ["/wait-for-it.sh", "mysql:3306", "--timeout=30", "--", "nodemon", "src/server.js"]
