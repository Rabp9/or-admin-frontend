'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:RolesAddCtrl
 * @description
 * # RolesAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('RolesAddCtrl', function ($scope, RolesService, $uibModalInstance, ControllersService) {
    $scope.rol = {};
    $scope.rol.controller_roles = [];
    
    $scope.loading = true;
    ControllersService.get(function(data) {
        $scope.rol.controller_roles = [];
        angular.forEach(data.controllers, function(value, key) {
            $scope.rol.controller_roles.push({
                controller_id: value.id,
                controller: value,
                permiso: false
            });
        });
        $scope.loading = false;
    });
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveRol = function(rol, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        RolesService.save(rol, function(data) {
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            $uibModalInstance.close(data);
        }, function(data) {
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            $uibModalInstance.close({
                message: {
                    type: 'error',
                    text: 'Hubo un error. Código: ' + data.status + ' Mensaje: ' + data.statusText
                }
            });
        });
    };
});