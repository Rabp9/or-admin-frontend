'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.clientesService
 * @description
 * # clientesService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('ClientesService', function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'clientes/:id.json', {}, {
        preview: {
            method: 'POST',
            url: EnvService.getHost() + 'clientes/preview/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'clientes/getAdmin/.json',
        }
    });
});