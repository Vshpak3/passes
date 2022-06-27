## Description

## Setup

System Requirements
- Node (`brew install node`)
- Yarn (`npm install -g yarn@berry`)


## Local Dev

### Setup

```bash
# downloads all dependencies
# this must be run whenever a new dependency is added
yarn install

# spins up docker containers for testing
yarn workspace @moment/api docker
```

### Local Testing

```bash
# run the frontend
yarn workspace @moment/ui dev

# run the background
yarn workspace @moment/api start:dev
```

### Test

```bash
# run tests for the backend
 yarn workspace @moment/api test
```

### Migrations

This should be run whenever you update an entity:

```bash
# generates the migrations
yarn workspace @moment/api migration:create

# run the migration
yarn workspace @moment/api migration:up
```

### OpenAPI

This should be run whenever you update a controller:

```bash
# regenerates open api client
./bin/generate-api-client.sh
```

### Adding Dependencies

```bash
# adding to the frontend
yarn workspace @moment/ui add <packageName>

# adding to the backend
yarn workspace @moment/api add <packageName>
```


## Other

### OpenAPI (Swagger)

To view all endpoints, visit:
- UI: http://localhost:3001/api
- JSON: http://localhost:3001/api-json

### Upgrading Dependencies

```bash
./bin/upgrade.sh
```
