FROM node:16-alpine as build

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

# Build the project
RUN yarn workspace @moment/api build


FROM node:16-alpine as release

# Setup the built code from the builder stage
USER node
WORKDIR /home/node
COPY --chown=node:node --from=build /usr/src/app .

# Set the env to production
ENV NODE_ENV "production"

# Set the command to run node
CMD ["node", "packages/api/dist/src/main.js"]
