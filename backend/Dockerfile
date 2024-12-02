FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "migrate"]

CMD ["npm", "run", "dev"]
