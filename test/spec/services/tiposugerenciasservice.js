'use strict';

describe('Service: TipoSugerenciasService', function () {

  // load the service's module
  beforeEach(module('tuplastAdminApp'));

  // instantiate service
  var TipoSugerenciasService;
  beforeEach(inject(function (_TipoSugerenciasService_) {
    TipoSugerenciasService = _TipoSugerenciasService_;
  }));

  it('should do something', function () {
    expect(!!TipoSugerenciasService).toBe(true);
  });

});
