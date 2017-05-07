'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:RolesCtrl
 * @description
 * # RolesCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('RolesCtrl', function ($scope, RolesService, $uibModal) {
    $scope.loading = true;
    RolesService.getAdmin(function(data) {
        $scope.roles = data.roles;
        $scope.loading = false;
    });
    
    $scope.showRolesAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/roles-add.html',
            controller: 'RolesAddCtrl',
            backdrop: false
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.roles.push(data.rol);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.showRolesEdit = function(rol, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/roles-edit.html',
            controller: 'RolesEditCtrl',
            backdrop: false,
            resolve: {
                rol: function() {
                    return rol;
                }
            }
        });
        
        modalInstanceEdit.result.then(function (data) {
            RolesService.getAdmin(function(data) {
                $scope.roles = data.roles;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
});