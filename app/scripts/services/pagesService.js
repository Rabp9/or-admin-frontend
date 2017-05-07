'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.pagesService
 * @description
 * # pagesService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('PagesService', function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'pages/:id.json', {}, {
        upload: {
            method: 'POST',
            url: EnvService.getHost() + 'pages/upload/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'pages/getAdmin/.json'
        }
    });
});