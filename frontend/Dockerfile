FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY public ./public
COPY src ./src

RUN npm install

RUN npm run build

FROM nginx:1.21

COPY --from=builder /dist/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
