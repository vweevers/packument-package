# packument-package

**Fetch package metadata of a version from the npm registry. If you need metadata of all versions, use [`packument`](https://www.npmjs.org/package/packument).**

[![npm](https://img.shields.io/npm/v/packument-package.svg)](https://www.npmjs.com/package/packument-package)
[![node](https://img.shields.io/node/v/packument-package.svg)](https://www.npmjs.com/package/packument-package)
[![Test](https://img.shields.io/github/workflow/status/vweevers/packument-package/Test?label=test)](https://github.com/vweevers/packument-package/actions/workflows/test.yml)
[![Standard](https://img.shields.io/badge/standard-informational?logo=javascript&logoColor=fff)](https://standardjs.com)

## example

```js
const getPackage = require('packument-package')

// Defaults to latest
getPackage('levelup', function (err, pkg) {
  if (err) throw err
  console.log(pkg.version)
})

getPackage('levelup', '~2.0.0', function (err, pkg) {
  if (err) throw err
  console.log(pkg.version)
})
```

## `getPackage(name[, version || opts], callback)`

Callback receives an error if any, a package object and response headers. Options:

- `version`: either a dist tag (`latest`), version (`1.2.3`) or range (`~1.2.3`).

Other options are passed to [`packument`](https://www.npmjs.org/package/packument).

## `getPackage = getPackage.factory(packument, opts)`

Preconfigure the function. Useful for setting defaults or adding a cache:

```js
const memoize = require('thunky-with-args')
const packument = memoize(require('packument').factory({ keepAlive: true }))
const getPackage = require('packument-package').factory(packument)

getPackage('levelup', '~2.0.2', (err, pkg) => {
  // It will make only one request
})

getPackage('levelup', '^1.3.0', (err, pkg) => {
  // Subsequent calls for the same package are cached
})
```

## install

With [npm](https://npmjs.org) do:

```
npm install packument-package
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
