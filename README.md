# KnowledgePlatformTest

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Development server

This test app includes a development-only customer proxy. It reproduces the
production responsibility of injecting `username` and `groups` into streaming
request payloads before they reach NestJS.

Start the proxy in the first terminal:

```bash
npm run proxy
```

It defaults to:

- NestJS: `http://183.82.145.33:9090`
- Local proxy: `http://localhost:9091`
- Username: `demo10@example.com`
- Groups: `finance`

Override these values when needed:

```bash
NEST_API_BASE_URL=http://localhost:8788 \
TEST_CHAT_USERNAME=alice@example.com \
TEST_CHAT_GROUPS=finance,legal \
npm run proxy
```

Start Angular in a second terminal:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
