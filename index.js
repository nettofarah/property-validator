var merge = require('lodash/merge');

var requestValidator = require('./lib/request_validator');
var validations = require('./lib/validations');
var assertions = require('./lib/assertions');

module.exports = merge(requestValidator, validations, assertions);
