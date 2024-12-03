FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install

COPY entry-point.sh ./entry-point.sh
RUN chmod +x entry-point.sh

RUN ./entry-point.sh

RUN npm run build

FROM nginx:1.21

COPY --from=builder /app/nginx /etc/nginx/conf.d
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
