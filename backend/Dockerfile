FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY .env.example ./.env

RUN npm install

RUN npm run migrate
RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "dev"]
