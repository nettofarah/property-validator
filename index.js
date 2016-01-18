var merge = require('lodash/merge');

var requestValidator = require('./lib/request_validator');
var assertions = require('./lib/request_assertions');
var validations = require('./lib/validations');

module.exports = merge(requestValidator, validations, assertions);
