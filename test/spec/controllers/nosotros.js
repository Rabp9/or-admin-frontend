'use strict';

describe('Controller: NosotrosCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var NosotrosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NosotrosCtrl = $controller('NosotrosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NosotrosCtrl.awesomeThings.length).toBe(3);
  });
});
