'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.envService
 * @description
 * # envService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('EnvService', function () {
    return {
        getHost: function() {
            switch (window.location.hostname) {
                case 'localhost':
                    return 'http://localhost:8000/or-backend/';
                case 'admin.tuplast.robertobocanegra.com':
                    return 'http://tuplast.robertobocanegra.com/api/';
                case 'tuplast.pe':
                    return 'http://tuplast.pe/api/';
                case 'www.tuplast.pe':
                    return 'http://tuplast.pe/api/';
            }
        }
    };
});