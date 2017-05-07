'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('UsersCtrl', function ($scope, UsersService, $uibModal) {
    $scope.loading = true;
    UsersService.getAdmin(function(data) {
        $scope.users = data.users;
        $scope.loading = false;
    });
    
    $scope.showUsersAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/users-add.html',
            controller: 'UsersAddCtrl',
            backdrop: false
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.users.push(data.user);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.showUsersEdit = function(user, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/users-edit.html',
            controller: 'UsersEditCtrl',
            backdrop: false,
            resolve: {
                user: function() {
                    return user;
                }
            }
        });
        
        modalInstanceEdit.result.then(function (data) {
            UsersService.getAdmin(function(data) {
                $scope.users = data.users;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
});