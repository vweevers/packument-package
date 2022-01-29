'use strict'

const packument = require('packument')
const semver = require('semver')

module.exports = factory(packument)
module.exports.factory = factory

function factory (packument, defaults) {
  return function (name, opts, callback) {
    if (typeof opts === 'string') {
      opts = { version: opts }
    } else if (typeof opts === 'function') {
      callback = opts
      opts = null
    }

    opts = Object.assign({}, defaults, opts)
    getPackage(packument, name, opts, callback)
  }
}

function getPackage (packument, name, opts, callback) {
  const version = opts.version || 'latest'

  packument(name, opts, function (err, packument, headers) {
    if (err) return callback(err)

    let pkg

    try {
      if (packument['dist-tags'][version]) {
        pkg = packument.versions[packument['dist-tags'][version]]
      } else if (packument.versions[version]) {
        pkg = packument.versions[version]
      } else {
        const versions = Object.keys(packument.versions)
        const match = semver.maxSatisfying(versions, version)

        pkg = match && packument.versions[match]
      }
    } catch (err) {
      return callback(err)
    }

    if (pkg == null) {
      return callback(new Error('package version does not exist'))
    }

    callback(null, pkg, headers)
  })
}
