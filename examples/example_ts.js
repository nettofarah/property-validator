'use strict'
exports.__esModule = true
var property_validator_1 = require('property-validator')
var user = {
  username: 'nettofarah',
  email_address: 'invalid@email'
}
property_validator_1.assert(user, [
  property_validator_1.presence('username'),
  property_validator_1.email('email_address')
])
