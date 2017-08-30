var validator = require('./request_validator')
var ValidationError = require('./validation_error')

function ensure(properties, validations, validationStrategy) {
  var validation = validationStrategy(properties, validations)

  if (!validation.valid) {
    throw new ValidationError(validation)
  }

  return validation
}

function assert(properties, validations) {
  return ensure(properties, validations, validator.validate)
}

function assertHeaders(req, validations) {
  return ensure(req, validations, validator.validateHeaders)
}

function assertParams(req, validations) {
  return ensure(req, validations, validator.validateParams)
}

function assertBody(req, validations) {
  return ensure(req, validations, validator.validateBody)
}

function assertQuery(req, validations) {
  return ensure(req, validations, validator.validateQuery)
}

function assertAll(req, validations) {
  return ensure(req, validations, validator.validateAll)
}

module.exports = {
  assert: assert,
  assertHeaders: assertHeaders,
  assertParams: assertParams,
  assertBody: assertBody,
  assertQuery: assertQuery,
  assertAll: assertAll
}
