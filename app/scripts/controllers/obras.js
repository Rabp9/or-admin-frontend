'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ObrasCtrl
 * @description
 * # ObrasCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ObrasCtrl', function ($scope, ObrasService, $uibModal) {
    $scope.loading = true;
    
    ObrasService.getAdmin(function(data) {
        $scope.obras = data.obras;
        $scope.loading = false;
    });
    
    $scope.showObrasAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/obras-add.html',
            controller: 'ObrasAddCtrl',
            backdrop: false,
            size: 'lg'
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.obras.push(data.obra);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.showObrasEdit = function(obra) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/obras-edit.html',
            controller: 'ObrasEditCtrl',
            backdrop: false,
            size: 'lg',
            resolve: {
                obra: function() {
                    return obra;
                }
            }
        });
        
        modalInstanceEdit.result.then(function (data) {
            ObrasService.getAdmin(function(data) {
                $scope.obras = data.obras;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
});