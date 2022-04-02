FROM node

WORKDIR /usr/app

# copiar o arquivo package.json para o WORKDIR
COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"]