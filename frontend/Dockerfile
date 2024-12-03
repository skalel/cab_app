FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

ARG VITE_APP_API_URL
ARG GOOGLE_API_KEY

ENV VITE_APP_API_URL=$VITE_APP_API_URL
ENV GOOGLE_API_KEY=$GOOGLE_API_KEY

RUN npm install

COPY entry-point.sh ./entry-point.sh
RUN chmod +x entry-point.sh

RUN ./entry-point.sh && npm run build

FROM nginx:1.21

COPY --from=builder /app/nginx /etc/nginx/conf.d
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
