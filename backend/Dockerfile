FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install

RUN npm run migrate
RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "dev"]
