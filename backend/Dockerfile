FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm install

EXPOSE 8080

COPY entry-point.sh ./entry-point.sh
RUN chmod +x entry-point.sh

CMD ["sh", "-c", "./entry-point.sh && npx prisma migrate reset --force && npm run dev"]
