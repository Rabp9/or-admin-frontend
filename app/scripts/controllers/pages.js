'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:PagesCtrl
 * @description
 * # PagesCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('PagesCtrl', function ($scope, PagesService, $uibModal) {
    $scope.loading = true;
    
    PagesService.getAdmin(function(data) {
        $scope.pages = data.pages;
        $scope.loading = false;
    });
    
    $scope.showPagesAdd = function($event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/pages-add.html',
            controller: 'PagesAddCtrl',
            backdrop: false,
            size: 'lg'
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.pages.push(data.page);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    
    $scope.showPagesEdit = function(page, $event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/pages-edit.html',
            controller: 'PagesEditCtrl',
            backdrop: false,
            size: 'lg',
            resolve: {
                page: function() {
                    return page;
                }
            }
        });
           
        modalInstanceEdit.result.then(function (data) {
            PagesService.getAdmin(function(data) {
                $scope.pages = data.pages;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
});