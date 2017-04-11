var assert = require('assert');

var validator = require('../index');

var presence = validator.presence;
var email = validator.email;
var ValidationError = validator.ValidationError;

describe('Assertions', function() {

  it('validates properties', function() {
    var properties = {
      login: 'nettofarah',
      email: 'nettofarah@gmail.com'
    };

    assert.doesNotThrow(function() {
      var assertion = validator.assert(properties, [
        presence('login'),
        email('email')
      ]);

      assert(assertion.valid);

    }, ValidationError);
  });

  describe('Invalid Assertions', function() {
    var invalidProperties  = {
      email_address: 'nettofarahatgmail.com'
    };

    it('throws an error when properties are invalid', function() {
      assert.throws(function() {
        validator.assert(invalidProperties, [
          email('email_address')
        ]);
      }, ValidationError);
    });

    it('returns all errors', function() {
      try {
        validator.assert(invalidProperties, [
          email('email_address')
        ]);
      } catch(validationError) {

        var expectedError = {
          field: 'email_address',
          message: 'The "email_address" must be a valid email address'
        }

        assert.equal(1, validationError.errors.length);
        assert.deepEqual([expectedError], validationError.errors);
      }
    });

    it('returns error messages', function() {
      try {
        validator.assert(invalidProperties, [
          email('email_address')
        ]);
      } catch(validationError) {
        var message = 'The "email_address" must be a valid email address';

        assert.deepEqual([message], validationError.messages);
      }
    });
  });
});
