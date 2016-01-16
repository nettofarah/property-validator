var every = require('lodash/every');
var omit = require('lodash/omit');

function validate(params, validations) {
  var runValidations = validations.map(function(validation) {
    return validation(params);
  });

  var allValid = every(runValidations, function(runValidation) {
    return runValidation.result;
  });

  var errors = runValidations.filter(function(runValidation) {
    return !runValidation.result;
  }).map(function(failedValidation) {
    return omit(failedValidation, 'result');
  });

  var messages = errors.map(function(error) {
    return error.message;
  });

  return {
    valid: allValid,
    errors: errors,
    messages: messages
  }
}

function validateParams(request, validations) {
  var params = request.params;
  return validate(params, validations);
}

module.exports = {
  validateParams: validateParams
}
