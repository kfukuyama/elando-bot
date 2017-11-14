FROM node:8-alpine

WORKDIR /app
COPY src .
RUN npm install

CMD ["node", "bot.js"]