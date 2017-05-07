'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:UsersLoginCtrl
 * @description
 * # UsersLoginCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('UsersLoginCtrl', function ($scope, UsersService, $uibModal, $cookies, $location, $rootScope) {
    
    $scope.loginUser = function(user, boton) {
        $('#' + boton).text('Login...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        UsersService.login(user, function(data) {
            if (!data.user) {
                $scope.message = data.message;
            } else {
                $cookies.putObject('tuplast-user', data.user);
                $cookies.put('tuplast-token', data.token);
                $rootScope.user = data.user;
                $('#wrapper').removeClass('inLogin');
                $location.path('/');
            }
        }, function(data) {
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            $('#' + boton).text('Login');
            $scope.message =  {
                type: 'error',
                text: 'Nombre de usuario o contraseña incorrecta'
            };
        });
    };
    
});