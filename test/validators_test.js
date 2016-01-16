var assert = require('assert')
var validator = require('../index')

describe('Validators', function() {

  describe('presence', function() {
    it('checks for the presence of a given key', function() {
      var params = {
        netto: 'cool'
      };

      var presenceValidator = validator.presence('netto');
      assert(presenceValidator(params).result);
      assert(presenceValidator({ not_netto: 'not cool' }).result == false);
    });

    it('resolves nested properties', function() {
      var params = {
        person: {
          name: 'Netto Farah'
        }
      };

      var presenceValidator = validator.presence('person.name');
      assert(presenceValidator(params).result);
      assert(presenceValidator({ person: 'shallow' }).result == false);
    });
  });

  describe('email', function() {

    it('validates emails', function() {
      var params = {
        netto: 'nettofarah@gmail.com'
      };

      var emailValidator = validator.email('netto');
      assert(emailValidator(params).result);
      assert(emailValidator({ netto: 'not an email' }).result == false);
    });

    it('works with nested props', function() {
      var params = {
        person: {
          email: 'nettofarah@gmail.com'
        }
      };

      var emailValidator = validator.email('person.email');
      assert(emailValidator(params).result);

      var invalidParams = {
        person: {
          email: 'invalid email'
        }
      };

      assert(emailValidator(invalidParams).result == false);
    });
  });
});
