'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:SliderCtrl
 * @description
 * # SliderCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('SliderCtrl', function ($scope, SlidesService, $uibModal) {
    $scope.loading = true;
    SlidesService.getAdmin(function(data) {
        $scope.slides = data.slides;
        $scope.loading = false;
    });
    
    $scope.sortableOptions = {
        'ui-floating': true,
        stop: function(e, ui) {
            for (var index in $scope.slides) {
                $scope.slides[index].orden = index;
            }
        }
    };
    
    $scope.saveOrden = function(slides) {
        SlidesService.saveMany({slides: slides}, function (data) {
            $scope.message = data.message;
        });
    };
  
    $scope.showSlidesAdd = function() {
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/slides-add.html',
            controller: 'SlidesAddCtrl',
            backdrop: false
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.slides.push(data.slide);
            $scope.message = data.message;
        });
    };
        
    $scope.showSlidesEdit = function(slide) {
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/slides-edit.html',
            controller: 'SlidesEditCtrl',
            backdrop: false,
            resolve: {
                slide: function() {
                    return slide;
                }
            }
        });
           
        modalInstanceEdit.result.then(function (data) {
            SlidesService.getAdmin(function(data) {
                $scope.slides = data.slides;
            });
            $scope.message = data.message;
        });
    };
});