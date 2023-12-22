FROM node:20-alpine

RUN apk add --update
RUN apk --no-cache add curl

WORKDIR /faucet

COPY . .
COPY ./package.json ./yarn.lock ./
RUN yarn --frozen-lockfile

ENTRYPOINT ["yarn"]
