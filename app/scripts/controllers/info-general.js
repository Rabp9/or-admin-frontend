'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:InfoGeneralCtrl
 * @description
 * # InfoGeneralCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('InfoGeneralCtrl', function ($scope, InfosService, $uibModal) {
    var search = ['resumen_tuplast', 'mensaje_clientes_1', 'mensaje_clientes_2', 'facebook_link', 'twitter_link', 'telf_oficina',
        'email_1', 'email_2', 'telf_area_tecnica', 'brochure', 'telf_area_ventas'
    ];
    
    $scope.loading = true;
    
    InfosService.getDataByData(search, function(data) {
        $scope.infos = data.infos;
        $scope.loading = false;
    });
    
    $scope.showInfosEdit = function(info, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/info-general-edit.html',
            controller: 'InfoGeneralEditCtrl',
            backdrop: false,
            resolve: {
                info: function() {
                    return info;
                }
            }
        });
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
        
        modalInstanceEdit.result.then(function (data) {
            InfosService.getDataByData(search, function(data) {
                $scope.infos = data.infos;
            });
            $scope.message = data.message;
        });
    };
});