var every = require('lodash/every')
var omit = require('lodash/omit')
var merge = require('lodash/merge')

function validate(params, validations) {
  var runValidations = validations.map(function(validation) {
    return validation(params)
  })

  var allValid = every(runValidations, function(runValidation) {
    return runValidation.result
  })

  var errors = runValidations
    .filter(function(runValidation) {
      return !runValidation.result
    })
    .map(function(failedValidation) {
      return omit(failedValidation, 'result')
    })

  var messages = errors.map(function(error) {
    return error.message
  })

  return {
    valid: allValid,
    errors: errors,
    messages: messages
  }
}

function validateParams(request, validations) {
  return validate(request.params, validations)
}

function validateQuery(request, validations) {
  return validate(request.query, validations)
}

function validateBody(request, validations) {
  return validate(request.body, validations)
}

function validateHeaders(request, validations) {
  return validate(request.headers, validations)
}

function validateAll(request, validations) {
  var allParams = merge(request.query, request.params, request.body)
  return validate(allParams, validations)
}

module.exports = {
  validateParams: validateParams,
  validateQuery: validateQuery,
  validateBody: validateBody,
  validateAll: validateAll,
  validateHeaders: validateHeaders,
  validate: validate
}
