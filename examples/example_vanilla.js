var validator = require('../index');

var presence = validator.presence;
var email = validator.email;
var assert = validator.assert;

var user = {
  username: 'nettofarah',
  email_address: 'invalid@email'
}

assert(user, [
  presence('username'),
  email('email_address')
]);
