
# Api Contributing Guide

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


## Development Setup/Prerequisites

- Node.js installed on your machine greater or equal to node `14.x.x`
- If using Redis locally, a local installed version of Redis is needed. If using a Mac, Please see this [guide](https://phoenixnap.com/kb/install-redis-on-mac) on how to install Redis with Brew.
- a populated `.env` and `.env.test`. Please ask your technical lead to help get this set up for you.

## Installation

```
npm install
```
### Committing Changes

Commit messages should follow the [commit message convention](https://github.com/commitizen/cz-cli) so that changelogs can be automatically generated. Commit messages will be validated automatically upon commit. We use [`commitizen`](https://github.com/commitizen/cz-cli) to generate our commit messages. Please run the following:

```
npm install -g commitizen
```

This will trigger the [`commitizen`](https://github.com/commitizen/cz-cli) CLI when running `git commit` in a commitizen-friendly repository. If you do not wish to install [`commitizen`](https://github.com/commitizen/cz-cli), `npm run commit` can be used as an alternative inside the repository.

This repo uses [husky](https://www.npmjs.com/package/husky) to run git commit hooks. When a commit is created, [`eslint`](https://www.npmjs.com/package/eslint) and [`prettier`](https://www.npmjs.com/package/prettier) will be run. If failures are detected in linting, formatting, or git commit message formating, the commit will **NOT** be committed.

To install Husky hooks, please run `npx husky install` in the root directory
## Creating Modules within Nest

When wanting to add a new module to our API, it is best to leverage the `@nestjs/cli`. The [CLI](https://docs.nestjs.com/cli/overview) will create the files you need to get started with your code, saving you time and adhering to best practices.

## Redis Sessions

Sessions are enabled by default and point to your local redis instance at `127.0.0.1`.

If you need to clear our your local Redis, please connect via the `redis-cli` and use the [FLUSHALL](https://redis.io/commands/flushall) command. **Note**: This will clear out all keys in your local redis instance, so use wisely.

## Testing

```bash
  # run all tests including unit and E2E
  $ npm run test

  # run only unit tests
  $ npm run test:unit

  # run only e2e tests
  $ npm run test:e2e
```

To debug Jest tests, please select the `Debug Jest Tests` option.

## CI/CD

- This repo has a robust [Github Actions]() workflow that executes tests and builds the application dockerfile.

## Debugging and Running the Server

To help understand code changes and reproduce issues, it is integral to have the ability to debug. To accomplish this, we leverage `VSCode` launch scripts To run these tasks in `VSCode`, please click the `Run` icon in the left pane, and select the `Debug Nest Server` task. This task will automatically read the environment variables in your `.env` and will attach a debugger to your VSCode.

If just wanting to run the server without debugging, you can elect one of the following options:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### DTOs (Data Transfer Objects) and Validation

To prevent any type of unsanitized data propagating its way into our API logic, nestjs leverages the concept of [DTOs](https://docs.nestjs.com/techniques/validation), DTOs work as a way to describe what the data payload should look like. Whether this is a GraphQL arg type, REST Query, Body, or Param, a DTO can desctibe its type. DTOs work hand in hand with
[`class-validator`](https://github.com/typestack/class-validator) and [`class-transformer`](https://github.com/typestack/class-transformer), which are decorator based libraries to check if a class/interface conforms to its type. Nestjs leverages this to make sure data fits the description you are looking for when receiving API arguments, and when the results do not conform, a 400
bad request is thrown.