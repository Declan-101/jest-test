# Module 4 Week 3 Day 1 Homework - Jest Testing

This project contains both homework apps: an Express API and a Vue app.

## Install and run all tests

From this folder:

```sh
npm --prefix expapp-test ci
npm --prefix vueapp-test/my-app ci
npm test
```

## Express app

```sh
cd expapp-test
npm start
npm test
```

Visit `http://localhost:3000/`, `/todo`, `/todo/1`, `/todo/2`, `/todo/3`, and `/joke`.
If another app uses port 3000, start this one with `PORT=3001 npm start`.

`index.js` exports the app for SuperTest and starts its server only when run directly. The API contains the three todo records from the homework and fetches a random joke from `https://api.chucknorris.io/jokes/random`.

`index.spec.js` covers the four core homework cases (all todos, todo 2, joke text, and two different joke responses), plus the greeting, remaining todos, invalid IDs, missing records, and external API failures. Nock provides controlled external API responses so ordinary tests work without internet and do not depend on random jokes. The real joke service can occasionally repeat a joke; two live random requests are not guaranteed to differ. The app itself calls the live API for every `/joke` request.

## Vue app

```sh
cd vueapp-test/my-app
npm run serve
npm run test:unit
npm run lint
npm run build
```

Open the address printed by the development server (usually `http://localhost:8080`). The app shows the Vue logo and **This is my first VUE app!**.

`MessageComponent.vue` accepts the `msg` prop and renders it in a paragraph. `App.vue` supplies the assigned message. Tests use Vue Test Utils and Jest to check the actual component, changed props, a missing prop, and the parent/child integration.

The app uses Vue 2.7 to match the homework's `propsData` and Vue 2 mounting syntax, with Vue CLI 5 and configurations in `package.json`. All CLI commands run locally; no global Vue CLI installation is required. The logo is a scalable SVG equivalent of the homework logo.

## Submission

The homework asks for a GitHub repository named `jest-test` containing `expapp-test` and `vueapp-test/my-app`. Upload this folder's contents, including both lockfiles, and submit the repository link to **GAP Week 7 Day 1 Homework**. Do not upload `node_modules` or `dist`; `.gitignore` excludes them.

## Verification

- Express: 16 tests pass.
- Vue: 4 tests pass, with no lint errors.
- Production build succeeds, and its rendered page was checked in Chrome.
- The live joke endpoint returned two valid, different responses during verification.

Vue CLI's legacy Vue 2 build emits two non-blocking style-module export warnings with the installed Webpack tooling. The generated CSS and browser layout were verified.
