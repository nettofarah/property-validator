var get = require('lodash/get');
var validator = require('validator')

function presence(paramName) {
  return function(params) {

    return {
      message: paramName + " required",
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
      message: paramName + " " + message,
      result: validator(param)
    }
  }
}

module.exports = {
  presence: presence,
  email: email
}
