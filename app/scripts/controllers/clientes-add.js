'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ClientesAddCtrl
 * @description
 * # ClientesAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ClientesAddCtrl', function ($scope, $uibModalInstance, ClientesService, NgMap) {
    $scope.cliente = {};
    $scope.loading = false;
    
    NgMap.getMap().then(function(map) {
        google.maps.event.trigger(map, 'resize'); 
    });
    
    $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBN3iXCosOm01j8X97QyrYYGfGRRRuyMFY";
        
    $scope.setMarker = function(event) {
        var ll = event.latLng;
        $scope.cliente.latitud = ll.lat();
        $scope.cliente.longitud = ll.lng();
    };
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveCliente = function(cliente, boton, url_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        if ($scope.cliente.latitud === undefined || $scope.cliente.longitud === undefined) {
            alert('Seleccione una ubicaciòn correcta');
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            return;
        }
        ClientesService.save(cliente, function(data) {
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