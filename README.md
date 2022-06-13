## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

### System Requirements
- Docker Desktop
- Node (`brew install node`)
- Yarn (`npm install -g yarn@berry`)

## Setup

We use Zero-Installs so there is no setup necessary.


## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

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

### OpenAPI (Swagger)

UI: http://localhost:3000/api
JSON: http://localhost:3000/api-json

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
