'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.obrasService
 * @description
 * # obrasService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('ObrasService', function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'obras/:id.json', {}, {
        preview: {
            method: 'POST',
            url: EnvService.getHost() + 'obras/preview/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'obras/getAdmin/.json',       
        },
        deleteImage: {
            method: 'POST',
            url: EnvService.getHost() + 'obras/deleteImage/.json',
        }
    });
});