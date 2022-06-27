## Description

## Setup

System Requirements
- Node (`brew install node`)
- Yarn (`npm install -g yarn@berry`)


## Local Dev

### Setup

```bash
# downloads all dependencies
yarn

# spins up docker containers
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
# run tests on the backend
 yarn workspace @moment/api test
```

### Migrations

```bash
# generates the migrations
yarn workspace @moment/api migration:create

# run the migration
yarn workspace @moment/api migration:up
```

### Adding Dependencies

```bash
# adding to the frontend
yarn workspace @moment/ui add <packageName>

# adding to the API
yarn workspace @moment/api add <packageName>
```


## Other

### OpenAPI (Swagger)
You must be running the API to access these:
UI: http://localhost:3001/api
JSON: http://localhost:3001/api-json

### Upgrading

```bash
$ ./bin/upgrade.sh
```
