FROM node:18

RUN mkdir -p /app

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

# Copiar el script de entrada
COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

EXPOSE 4200

ENTRYPOINT ["/app/entrypoint.sh"]