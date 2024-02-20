FROM node:16 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g @nestjs/cli
RUN npm install
COPY . .
RUN npm run build

FROM node:16
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser
WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /app .
ENV KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
ENV KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT
ENV KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT
ENV KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
EXPOSE 3000
CMD ["node", "/app/dist/src/main.js"]
