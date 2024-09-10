# install
FROM node:20 as base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# build
FROM base as build
WORKDIR /usr/src/app

RUN npm run build


# production
FROM node:20-alpine
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/config ./config
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/src/i18n ./src/i18n
COPY --from=build /usr/src/app/next.config.js ./next.config.js
# COPY --from=build /usr/src/app/server.js ./server.js

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "start"]
