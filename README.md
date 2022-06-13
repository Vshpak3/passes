## Description

## Setup

System Requirements
- Docker Desktop
- Node (`brew install node`)
- Yarn (`npm install -g yarn@berry`)

We use Zero-Installs so there is no setup necessary.


## Local Dev

### Running

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

### Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### Migrations

```bash
$ yarn mikro-orm                  # lists available commands
$ yarn mikro-orm migration:create # generates the migration
$ yarn mikro-orm migration:up     # run the migration
```


## Other

### OpenAPI (Swagger)

UI: http://localhost:3000/api
JSON: http://localhost:3000/api-json

### Upgrading

```bash
$ ./bin/upgrade.sh
```
