'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:HeadersCtrl
 * @description
 * # HeadersCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('HeadersCtrl', function ($scope, HeadersService, $uibModal) {
    $scope.loading = true;
    
    HeadersService.getAdmin(function(data) {
        $scope.headers = data.headers;
        $scope.loading = false;
    });
    
    $scope.showHeadersEdit = function(header, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/headers-edit.html',
            controller: 'HeadersEditCtrl',
            backdrop: false,
            resolve: {
                header: function() {
                    return header;
                }
            }
        });
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
        
        modalInstanceEdit.result.then(function (data) {  
            $scope.loading = true;
            HeadersService.getAdmin(function(data) {
                $scope.headers = data.headers;
                $scope.loading = false;
            });
            $scope.message = data.message;
        });
    };
});