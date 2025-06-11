FROM node:20-alpine

WORKDIR /usr/src/ms-auth
RUN npm i -g pnpm
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm run build
EXPOSE 3001

CMD ["pnpm", "run", "dev"]