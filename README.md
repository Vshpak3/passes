# Moment Monorepo

## Setup

System Requirements
- Node: `brew install node`
- Yarn: `npm install -g yarn@berry`


## Local Dev

### Setup

```bash
# downloads all dependencies
# this must be run whenever a new dependency is added
yarn install

# backend: spins up docker containers for testing
yarn workspace @moment/api docker
```

### Local Testing

```bash
# frontend
yarn workspace @moment/ui dev

# backend
yarn workspace @moment/api start:dev
```

### Test

```bash
# backend: runs tests
yarn workspace @moment/api test
```

### Migrations (backend)

This should be run whenever you update an entity:

```bash
# generates the migrations
yarn workspace @moment/api migration:create

# runs the migration
yarn workspace @moment/api migration:up
```

### OpenAPI (backend)

This should be run whenever you update a controller:

```bash
# regenerates open api client
./bin/generate-api-client.sh
```

To view OpenAPI endpoints, visit:
- UI: http://localhost:3001/api
- JSON: http://localhost:3001/api-json

### Adding Dependencies

```bash
# frontend
yarn workspace @moment/ui add <packageName>

# backend
yarn workspace @moment/api add <packageName>
```

The following script upgrades all dependencies:

```bash
./bin/upgrade.sh
```
