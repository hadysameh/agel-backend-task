FROM node:18
WORKDIR /app
COPY package.*json .
RUN npm install
COPY . .
ENV PORT = 3125
EXPOSE 3125
CMD [ "npm", "run","dev" ]