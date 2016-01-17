var assert = require('assert');
var requestAssertions = require('../lib/request_assertions');
var validations = require('../lib/validations');

var presence = validations.presence;
var email = validations.email;
var ValidationError = requestAssertions.ValidationError;

describe('Assertions', function() {

  it('validates properties', function() {
    var properties = {
      login: 'nettofarah',
      email: 'nettofarah@gmail.com'
    };

    assert.doesNotThrow(function() {
      var assertion = requestAssertions.assert(properties, [
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
        requestAssertions.assert(invalidProperties, [
          email('email_address')
        ]);
      }, ValidationError);
    });

    it('returns all errors', function() {
      try {
        requestAssertions.assert(invalidProperties, [
          email('email_address')
        ]);
      } catch(validationError) {

        var expectedError = {
          field: 'email_address',
          message: `"email_address" should look like an email address`
        }

        assert.equal(1, validationError.errors.length);
        assert.deepEqual([expectedError], validationError.errors);
      }
    });

    it('returns error messages', function() {
      try {
        requestAssertions.assert(invalidProperties, [
          email('email_address')
        ]);
      } catch(validationError) {
        var message = `"email_address" should look like an email address`;

        assert.deepEqual([message], validationError.messages);
      }
    });
  });
});
