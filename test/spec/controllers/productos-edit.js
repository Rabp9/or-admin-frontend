'use strict';

describe('Controller: ProductosEditCtrl', function () {

  // load the controller's module
  beforeEach(module('tuplastAdminApp'));

  var ProductosEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductosEditCtrl = $controller('ProductosEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProductosEditCtrl.awesomeThings.length).toBe(3);
  });
});
