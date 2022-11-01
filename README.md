# Passes Monorepo

Welcome to the Passes monorepo! This repo contains both our backend and frontend
code. You must set up both to be able to run the application locally.

System Requirements

- macOS or Linux
- Node: `brew install node`
- Yarn: `npm install -g yarn@berry`
- MySQL: `brew install mysql`
- Docker: [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## General

### One-time Setup

Run the following command to setup the repository:

```bash
./bin/local-setup.sh
```

### On Rebase / Pulling New Code

After rebasing, you may have to run the above setup command again for the
application to run properly.

### Running Locally

You can spin up the backend and frontend servers by running the following
commands:

```bash
yarn workspace @passes/api dev
yarn workspace @passes/ui dev
```

You can then access the site at `http://localhost:3000` and the backend OpenAPI
docs at `http://localhost:3001/api`.

You can also use the OpenAPI server to send API requests to the backend for
testing. For this to work, you first need to log in to the application at
`http://localhost:3000/login`. Next go to the console and run:

```js
JSON.parse(window.localStorage.getItem('access-token'))
```

Finally, copy the output, navigate to `http://localhost:3001/api`, click on
the "Authorize" button in the top right, and paste in the output.

### Unit Tests and Linting

To run linting checks for the frontend and backend, run the following commands:

```bash
# runs prettier lint fixes and checks
yarn workspace @passes/api prettier:fix
yarn workspace @passes/ui prettier:fix

# runs eslint lint fixes and checks
yarn workspace @passes/api lint:fix
yarn workspace @passes/ui lint:fix
```

The following commands run tests for only the backend:

```bash
# runs backend tests
yarn workspace @passes/api test

# ensures all config keys are defined in all environments (requires infra repo)
./bin/config-check.sh
```

### Adding Dependencies

```bash
# adds dependency
yarn workspace @passes/api add <packageName>
yarn workspace @passes/ui add <packageName>

# lists unused dependency
yarn workspace @passes/api depcheck
yarn workspace @passes/ui depcheck

# upgrades all dependencies
./bin/upgrade.sh
```

## Backend Specific

### Databases and Migrations

The docker command in the setup step will create the local testing database. You
can then access the database via:

```bash
# one time installation
brew install mysql-client

# starts mysql shell
./bin/mysql.sh connect
```

The following script will wipe any local migration files and regenerate all
migrations based on the state of your local database and entities:

```bash
# just migrations
./bin/reset-local-database.sh

# also will reset the local database and delete all of its data
./bin/reset-local-database.sh full
```

You can also run the migrations manually:

```bash
# generates the migrations
yarn workspace @passes/api migration:create

# runs the migration
yarn workspace @passes/api migration:up
```

### Config

Configs are stored in `packages/api/src/config/.env.ENV` where `ENV` is one of:

- `dev`: for local testing; feel free to commit sandbox/test secrets to this file
- `stage`: for code running in staging; do not commit secrets to this file
- `prod`: for code running in production; do not commit secrets to this file

Whenever you add/remove config values you must do so across all of these files
and then update `packages/api/src/config/config.schema.ts`. In particular, both
`configValidationSchema` and `configConfiguration` must be updated.

For `stage` and `prod` you set a value to `secret/some-identifier` which will
result in retrieving the secret in AWS Secret Manager with the given
identifier. Make sure that AWS Secret Manager has this identifier before
merging/deploying; otherwise the deploy will fail.

### OpenAPI

This must be run whenever you update a controller:

```bash
# regenerates openapi client
./bin/generate-api-client.sh
```

To view OpenAPI endpoints, visit:

- UI: http://localhost:3001/api
- JSON: http://localhost:3001/api-json
