FROM node:20-alpine
WORKDIR /app
COPY package*.json .
# ENV NODE_ENV=development
RUN npm install
COPY . .
CMD ["npm", "run", "dev","--host"]