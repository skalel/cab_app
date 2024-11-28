FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx:1.21

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
