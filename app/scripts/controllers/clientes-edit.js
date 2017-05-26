'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ClientesEditCtrl
 * @description
 * # ClientesEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ClientesEditCtrl', function ($scope, cliente, $uibModalInstance, ClientesService, NgMap) {
    $scope.cliente = $.extend(true, {}, cliente);
    $scope.loading = false;
    
    $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBN3iXCosOm01j8X97QyrYYGfGRRRuyMFY";
    
    NgMap.getMap().then(function(map) {
        google.maps.event.trigger(map, 'resize'); 
        $scope.lat_def = $scope.cliente.latitud;
        $scope.long_def = $scope.cliente.longitud;
    });
    
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