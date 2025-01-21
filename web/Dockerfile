FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

RUN npm install -g serve

COPY . .

RUN npm run build

EXPOSE 3003

CMD ["serve", "-s", "dist", "-l", "3003"]
