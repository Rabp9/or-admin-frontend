'use strict';

describe('Controller: ProductosAddCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var ProductosAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductosAddCtrl = $controller('ProductosAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductosAddCtrl.awesomeThings.length).toBe(3);
  });
});
