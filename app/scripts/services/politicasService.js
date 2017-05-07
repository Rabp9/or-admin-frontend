'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.politicas
 * @description
 * # politicas
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('PoliticasService', function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'politicas/:id.json', {}, {
        preview: {
            method: 'POST',
            url: EnvService.getHost() + 'politicas/preview/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'politicas/getAdmin/.json'
        }
    });
});