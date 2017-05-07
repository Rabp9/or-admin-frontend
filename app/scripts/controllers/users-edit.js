'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:UsersEditCtrl
 * @description
 * # UsersEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('UsersEditCtrl', function ($scope, user, $uibModalInstance, UsersService, RolesService) {
    $scope.user = $.extend(true, {}, user);
    $scope.loading = true;
    
    RolesService.get(function(data) {
        $scope.roles = data.roles;
        $scope.loading = false;
    });
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveUser = function(user, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        UsersService.save(user, function(data) {
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