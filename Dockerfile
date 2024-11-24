FROM node:18

RUN mkdir -p /app

WORKDIR /app

COPY package*.json /app

RUN npm install

RUN npx tailwindcss init

COPY . /app

RUN npm run build --prod

EXPOSE 4200

ENTRYPOINT ["npm", "start"]
