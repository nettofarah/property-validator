var assert = require('assert');

var validator = require('../index')
var email = validator.email;
var presence = validator.presence;

function fakeRequest() {
  return {
    params: {},
    query: {},
    body: {}
  }
}

// Used to setup some generic tests
//
// title -> Body, Request or Query validations
// validateFunction -> Function used to validate params: validateBody, validateQuery, validateParams
// property -> which property of the request to use for setting up the params.
//  request.body, request.query, request.params
//
function validation(title, validateFunction, property) {
  describe(title, function() {
    var req;

    before(function() {
      req = fakeRequest();
    });

    it('runs validations on the request ' + title, function() {
      req[property] = {
        login: 'nettofarah',
        password: 'secret',
        email: 'nettofarah@gmail.com'
      };

      var validation = validateFunction(req, [
        presence('login'),
        presence('password'),
        email('email')
      ]);

      assert(validation.valid);
      assert(validation.errors.length == 0);
    });

    describe('failed validations', function() {
      var validation;

      before(function() {
        req[property] = {
          login: 'nettofarah',
          email: 'nettofarahatgmail.com'
        };

        validation = validateFunction(req, [
          presence('login'),
          presence('password'),
          email('email')
        ]);
      });

      it('only passes if all validations pass', function() {
        assert(validation.valid == false);
      });

      it('returns all failed validations', function() {
        assert(validation.errors.length == 2);
        assert(validation.errors[0].field == 'password');
        assert(validation.errors[1].field == 'email');
      });

      it('returns all the error messages', function() {
        assert.deepEqual(validation.messages, [
          '"password" required',
          '"email" should look like an email address'
        ]);
      });
    });
  });
}

validation('Body Validation', validator.validateBody, 'body');
validation('Params Validation', validator.validateParams, 'params');
validation('Query String Validation', validator.validateQuery, 'query');
validation('Headers Validation', validator.validateHeaders, 'headers');

describe('Validate all', function() {

  it('validates all properties across body, query and params', function() {
    var req = fakeRequest();

    req.body = {
      password: 'secret'
    };

    req.query = {
      email: 'nettofarah@gmail.com'
    };

    req.params = {
      login: 'nettofarah'
    };

    var validation = validator.validateAll(req, [
      presence('password'),
      email('email'),
      presence('login')
    ]);

    assert(validation.valid);
  });
});
