FROM node:20-alpine

WORKDIR /usr/src/api-gateway
RUN npm i -g pnpm
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm run build
EXPOSE 3000

CMD ["pnpm", "run", "dev"]