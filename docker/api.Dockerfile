FROM node:16-alpine as release

WORKDIR /usr/src/app

# Copy in all files
COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml .
COPY package.json .
COPY packages packages
COPY tsconfig.json .
COPY yarn.lock .

# Install all dependencies
RUN yarn install
RUN yarn config set enableNetwork false


WORKDIR /usr/src/app/packages/shared/packages/utils
RUN yarn workspaces focus
RUN yarn clean
RUN yarn build

WORKDIR /usr/src/app/packages/contracts
RUN yarn workspaces focus
RUN yarn dist-clean
RUN yarn build

WORKDIR /usr/src/app

RUN (cd ./packages/api && yarn workspaces focus)
RUN yarn workspace @moment/api build
RUN yarn workspace @moment/api prod-install --pack /usr/src/build


FROM alpine as release

WORKDIR /home/node

RUN addgroup -g 1000 node \
  && adduser -u 1000 -G node -s /bin/sh -D node \
  && apk add --no-cache tini libstdc++

ENV NODE_ENV "production"
ENV NODE_OPTIONS "--require ./.pnp.cjs"

ENV PORT 80

COPY --from=build /usr/local/bin/node /usr/local/bin/

COPY --chown=node:node --from=build /usr/src/build .

USER node

EXPOSE $PORT

VOLUME ["/home/node"]

ENTRYPOINT [ "/sbin/tini", "--", "node", "." ]

FROM install as local

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

VOLUME ["/home/node"]
