var assert = require('assert');
var validator = require('../index')

describe('Validators', function() {

  describe('presence', function() {
    it('checks for the presence of a given key', function() {
      var params = {
        netto: 'cool'
      };

      var presenceValidator = validator.presence('netto')
      assert(presenceValidator(params).result)
      assert(presenceValidator({ not_netto: 'not cool' }).result == false)
    });

    it('resolves nested properties', function() {
      var params = {
        person: {
          name: 'Netto Farah'
        }
      };

      var presenceValidator = validator.presence('person.name')
      assert(presenceValidator(params).result)
      assert(presenceValidator({ person: 'shallow' }).result == false)
    });
  });
});
