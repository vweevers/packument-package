'use strict'

const test = require('tape')
const nock = require('nock')
const getPackage = require('.')
const good = { foo: 123 }
const bad = { bar: 987 }

test('defaults to latest', function (t) {
  t.plan(2)

  nock('https://registry.npmjs.org')
    .get('/test')
    .reply(function (uri) {
      return [200, {
        'dist-tags': {
          latest: '2.0.0'
        },
        versions: {
          '2.0.0': good,
          '1.0.0': bad
        }
      }]
    })

  getPackage('test', function (err, pkg) {
    t.ifError(err, 'no error')
    t.same(pkg, good, 'got package')
  })
})

test('get dist tag', function (t) {
  t.plan(2)

  nock('https://registry.npmjs.org')
    .get('/test')
    .reply(function (uri) {
      return [200, {
        'dist-tags': {
          next: '3.0.0-beta',
          latest: '2.0.0'
        },
        versions: {
          '3.0.0-beta': good,
          '2.0.0': bad
        }
      }]
    })

  getPackage('test', 'next', function (err, pkg) {
    t.ifError(err, 'no error')
    t.same(pkg, good, 'got package')
  })
})

test('get dist tag with options object', function (t) {
  t.plan(2)

  nock('https://registry.npmjs.org')
    .get('/test')
    .reply(function (uri) {
      return [200, {
        'dist-tags': {
          next: '3.0.0-beta',
          latest: '2.0.0'
        },
        versions: {
          '3.0.0-beta': good,
          '2.0.0': bad
        }
      }]
    })

  getPackage('test', { version: 'next' }, function (err, pkg) {
    t.ifError(err, 'no error')
    t.same(pkg, good, 'got package')
  })
})

test('get specific version', function (t) {
  t.plan(2)

  nock('https://registry.npmjs.org')
    .get('/test')
    .reply(function (uri) {
      return [200, {
        'dist-tags': {
          latest: '2.0.0'
        },
        versions: {
          '3.0.0-beta': good,
          '2.0.0': bad
        }
      }]
    })

  getPackage('test', '3.0.0-beta', function (err, pkg) {
    t.ifError(err, 'no error')
    t.same(pkg, good, 'got package')
  })
})

test('get max satisfying', function (t) {
  t.plan(2)

  nock('https://registry.npmjs.org')
    .get('/test')
    .reply(function (uri) {
      return [200, {
        'dist-tags': {
          latest: '2.1.0'
        },
        versions: {
          '2.1.0': bad,
          '2.0.4': good,
          '2.0.0': bad
        }
      }]
    })

  getPackage('test', '~2.0.2', function (err, pkg) {
    t.ifError(err, 'no error')
    t.same(pkg, good, 'got package')
  })
})

test('out of range', function (t) {
  t.plan(1)

  nock('https://registry.npmjs.org')
    .get('/test')
    .reply(function (uri) {
      return [200, {
        'dist-tags': {
          latest: '2.1.0'
        },
        versions: {
          '2.1.0': bad,
          '2.0.4': good,
          '2.0.0': bad
        }
      }]
    })

  getPackage('test', '~3.0.2', function (err) {
    t.is(err && err.message, 'package version does not exist')
  })
})
