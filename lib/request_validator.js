var get = require('lodash/get');

function presence(paramName) {
  return function(params) {

    return {
      message: paramName + " required",
      result: !!get(params, paramName)
    }
  }
}

module.exports = {
  presence: presence
}
