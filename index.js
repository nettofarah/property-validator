var merge = require('lodash/merge')

var requestValidator = require('./lib/request_validator')
var assertions = require('./lib/request_assertions')
var validations = require('./lib/validations')

var ValidationError = require('./lib/validation_error')
var assertMiddleware = require('./lib/assert_middleware')

module.exports = merge(requestValidator, validations, assertions, {
  ValidationError: ValidationError,
  assertMiddleware: assertMiddleware
})
