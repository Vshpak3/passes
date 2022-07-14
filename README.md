# Moment Monorepo

## Setup

System Requirements
- macOS or Linux
- Node: `brew install node`
- Yarn: `npm install -g yarn@berry`


## Backend

### Setup

```bash
# downloads all dependencies; this must be run whenever a new dependency is added/removed
yarn install

# spins up docker containers for testing
yarn workspace @moment/api docker
```

### Local Testing

```bash
# starts server
yarn workspace @moment/api start:dev
```

### Unit Tests and Linting

```bash
# runs tests
yarn workspace @moment/api test

# runs prettier lint fixes
yarn workspace @moment/api prettier:fix

# runs eslint lint fixes
yarn workspace @moment/api lint:fix

# ensures all config keys are defined in all environments
./bin/config-check.sh
```

### Databases and Migrations

The docker command in the setup step will create the local testing database. You
can then access the database via:

```bash
PGPASSWORD=root psql -U root -p 5432 -h 127.0.0.1 -d moment
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
yarn workspace @moment/api migration:create

# runs the migration
yarn workspace @moment/api migration:up
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

This should be run whenever you update a controller:

```bash
# regenerates openapi client
./bin/generate-api-client.sh
```

To view OpenAPI endpoints, visit:
- UI: http://localhost:3001/api
- JSON: http://localhost:3001/api-json

### Adding Dependencies

```bash
yarn workspace @moment/api add <packageName>
```

The following script upgrades all dependencies:

```bash
./bin/upgrade.sh
```


## Frontend

### Setup

```bash
# downloads all dependencies; this must be run whenever a new dependency is added/removed
yarn install
```

### Local Testing

```bash
yarn workspace @moment/ui dev
```

### Test

```bash
# no tests yet
```

### Adding Dependencies

```bash
yarn workspace @moment/ui add <packageName>
```
