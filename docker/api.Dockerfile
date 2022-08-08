FROM node:16-alpine as build

WORKDIR /usr/src/app

# Copy in all files
COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml .
COPY package.json .
COPY packages packages
COPY tsconfig.json .
COPY yarn.lock .
COPY bin/run-database-migrations.sh bin/run-database-migrations.sh

# Transitive dependencies of web3 (bufferutil and utf-8-validate) require these
# packages to be built and subsequently installed
RUN apk add --update --no-cache \
    python3 \
    make \
    gcc \
    g++

# Install all dependencies
RUN yarn install
RUN yarn config set enableNetwork false

# Build the project
RUN yarn workspace @passes/api build


FROM node:16-alpine as release

# Setup the built code from the builder stage
USER node
WORKDIR /home/node
COPY --chown=node:node --from=build /usr/src/app .

# Set the command to run node
CMD ["node", "packages/api/dist/src/main.js"]
