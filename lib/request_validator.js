var get = require('lodash/get');
var every = require('lodash/every');
var omit = require('lodash/omit');

var validator = require('validator')

function presence(paramName) {
  return function(params) {

    return {
      field: paramName,
      message: "\""+ paramName +"\"" + " required",
      result: !!get(params, paramName)
    }
  }
}

function email(paramName) {
  return checkParam(paramName, 'should look like an email address', validator.isEmail)
}

function checkParam(paramName, message, validator) {
  return function(params) {
    var param = get(params, paramName)

    return {
      field: paramName,
      message: "\""+ paramName +"\" " + message,
      result: validator(param)
    }
  }
}

function validateParams(request, validations) {
  var params = request.params;

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

module.exports = {
  presence: presence,
  email: email,
  validateParams: validateParams
}
