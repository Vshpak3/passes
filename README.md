## Description

## Setup

System Requirements
- Node (`brew install node`)
- Yarn (`npm install -g yarn@berry`)

We use Zero-Installs so there is no setup necessary.


## Local Dev

### Running

```bash
# run the UI
yarn workspace @moment/ui dev

# run the API
yarn workspace @moment/api start:dev
```

### Adding Dependencies

```bash
# adding to the UI
yarn workspace @moment/ui add <packageName>

# adding to the API
yarn workspace @moment/api add <packageName>
```

### Test
How do we run tests?
TODO: The commands below need to be updated
```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### Migrations

TODO: We need to test these commands with a database running
```bash
$ yarn workspace @moment/api mikro-orm                  # lists available commands
$ yarn workspace @moment/api mikro-orm migration:create # generates the migration
$ yarn workspace @moment/api mikro-orm migration:up     # run the migration
```


## Other

### OpenAPI (Swagger)
You must be running the API to access these:
UI: http://localhost:3333/api
JSON: http://localhost:3333/api-json

### Upgrading

```bash
$ ./bin/upgrade.sh
```
