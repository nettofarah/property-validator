var assert = require('assert');
var validator = require('../index')

var email = validator.email;
var presence = validator.presence;
var validateParams = validator.validateParams;

describe('Request validation', function() {

  describe('Params', function() {

    var req;

    before(function() {
      req = {
        params: {}
      }
    });

    it('runs validations on the request params', function() {
      req.params = {
        login: 'nettofarah',
        password: 'secret',
        email: 'nettofarah@gmail.com'
      };

      var validation = validateParams(req, [
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
        req.params = {
          login: 'nettofarah',
          email: 'nettofarahatgmail.com'
        };

        validation = validateParams(req, [
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
});
