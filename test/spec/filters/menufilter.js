'use strict';

describe('Filter: menuFilter', function () {

  // load the filter's module
  beforeEach(module('tuplastAdminApp'));

  // initialize a new instance of the filter before each test
  var menuFilter;
  beforeEach(inject(function ($filter) {
    menuFilter = $filter('menuFilter');
  }));

  it('should return the input prefixed with "menuFilter filter:"', function () {
    var text = 'angularjs';
    expect(menuFilter(text)).toBe('menuFilter filter: ' + text);
  });

});
