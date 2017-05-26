'use strict';

/**
 * @ngdoc filter
 * @name tuplastAdminApp.filter:tipoProducto
 * @function
 * @description
 * # tipoProducto
 * Filter in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.filter('tipoProducto', function () {
    return function (tipo) {
        switch(tipo) {
            case 'P':
                return 'Página';
            case 'A':
                return 'Area';
            case 'L':
                return 'Línea de Producto';
        }
    };
});