'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.productosService
 * @description
 * # productosService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('ProductosService', function ($resource, EnvService) {
    return $resource(EnvService.getHost() + 'productos/:id.json', {}, {
        preview: {
            method: 'POST',
            url: EnvService.getHost() + 'productos/preview/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'productos/getAdmin/.json'
        },
        deleteImage: {
            method: 'POST',
            url: EnvService.getHost() + 'productos/deleteImage/.json'
        },
        getTreeList: {
            method: 'GET',
            url: EnvService.getHost() + 'productos/getTreeList/:spacer.json'
        },
        previewBrochure: {
            method: 'POST',
            url: EnvService.getHost() + 'productos/previewBrochure/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        remove: {
            method: 'POST',
            url: EnvService.getHost() + 'productos/remove/.json'
        },
    });
});