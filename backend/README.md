## Installation

```bash
$ pnpm install
```

## Setting env variable
There is .env.sample. It is an example of what .env file in root app directory you need to have to successfuly launch the app. You can copy this template

```bash
nano .env.sample > .env
```

And fill variables in .env file. After you can go to the running step.

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test
```

## License

Nest is [MIT licensed](LICENSE).
