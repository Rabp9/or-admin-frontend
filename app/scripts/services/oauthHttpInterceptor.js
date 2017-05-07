'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.oauthHttpInterceptor
 * @description
 * # oauthHttpInterceptor
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('oauthHttpInterceptor', function ($cookies) {
    return {
        request: function (config) {
            config.headers.Authorization = 'Bearer ' + $cookies.get('tuplast-token');
            return config;
        }
    };
});