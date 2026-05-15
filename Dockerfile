FROM node:20-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    libsqlite3-dev

COPY package*.json ./

RUN npm install --build-from-source sqlite3

COPY . .

EXPOSE 3000

CMD ["npm", "start"]