var assert = require('assert');
var validator = require('../index')

var email = validator.email;
var presence = validator.presence;
var validate = validator.validate;

describe('Translation', function() {
  var params;

  before(function() {
    params = {};
  });

  after(function() {
    var defaultLocals = require('../lib/translations/en');
    validator.setLocals(defaultLocals);
  });

  it('allows overriding of custom message', function() {
    params = {
      email: 'arghs'
    };

    var validation = validate(params, [
      presence('login', 'login aint here'),
      email('email', 'ooh boy this doesn\'t look like a :paramName at all')
    ]);

    assert(validation.errors[0].message == 'login aint here');
    assert(validation.errors[1].message == 'ooh boy this doesn\'t look like a email at all');
  });

  it('allows overriding of default translations', function() {
    params = {
      email: 'arghs'
    };

    validator.setLocals({
        required: 'login aint here',
        email: 'ooh boy this doesn\'t look like a :paramName at all'
    });

    var validation = validate(params, [
      presence('login'),
      email('email')
    ]);

    assert(validation.errors[0].message == 'login aint here');
    assert(validation.errors[1].message == 'ooh boy this doesn\'t look like a email at all');
  });

  it('should fall back to default locals if a certain message ain\'t set through setLocals', function() {
    params = {
      email: 'arghs'
    };

    validator.setLocals({
        required: 'login aint here',
    });

    var validation = validate(params, [
      presence('login'),
      email('email')
    ]);

    assert(validation.errors[0].message == 'login aint here');
    assert(validation.errors[1].message == '"email" should look like an email address');
  });

});
