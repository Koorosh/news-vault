FROM node:10-alpine AS build
WORKDIR /usr/src/app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
COPY knexfile.ts ./
COPY tsconfig.json ./
COPY package.json ./
COPY yarn.lock ./
COPY src ./src
RUN yarn && yarn build

FROM node:10-alpine
RUN apk update \
    && apk add curl \
    && echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories \
    && echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories \
    && apk add --no-cache \
        chromium@edge=~73.0.3683.103 \
        nss@edge \
        freetype@edge \
        freetype-dev@edge \
        harfbuzz@edge \
        ttf-freefont@edge

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/lib ./lib
COPY --from=build /usr/src/app/package.json ./package.json
EXPOSE 8080
CMD [ "yarn", "start" ]