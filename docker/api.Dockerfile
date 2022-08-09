FROM node:16-alpine as build

WORKDIR /usr/src/app

# Transitive dependencies of web3 (bufferutil and utf-8-validate) require these
# packages to be built and subsequently installed
RUN apk add --update --no-cache \
    python3 \
    make \
    gcc \
    g++

# Copy in all files
COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml .
COPY package.json .
COPY packages/api/package.json packages/api/package.json
COPY tsconfig.json .
COPY yarn.lock .
COPY bin/run-database-migrations.sh bin/run-database-migrations.sh

# Install all dependencies of @passes/api workspace
RUN yarn set version berry
RUN yarn plugin import workspace-tools@3.1.3
RUN yarn workspaces focus @passes/api
RUN yarn config set enableNetwork false


# Build the project
COPY packages/api packages/api
RUN yarn workspace @passes/api build

# Purge dev dependencies
# TODO: Find a better way to do it
RUN rm -rf node_modules
RUN yarn cache clean
RUN yarn workspaces focus @passes/api --production

FROM node:16-alpine as release

# Setup the built code from the builder stage
USER node
WORKDIR /home/node
COPY --chown=node:node --from=build /usr/src/app .

# Set the command to run node
CMD ["node", "packages/api/dist/src/main.js"]
