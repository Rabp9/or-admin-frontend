'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ProductosAddCtrl
 * @description
 * # ProductosAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ProductosAddCtrl', function ($scope, ProductosService, $uibModalInstance) {
    $scope.producto = {};
    $scope.methods = {};
    var tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp' + '/';
    $scope.loading = false;
    
    ProductosService.getTreeList({spacer: '_'}, function(data) {
        $scope.productos_list = data.productos;
    });
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveProducto = function(producto, boton, urls_preview, brochure_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        producto.producto_images = [];
        angular.forEach(urls_preview, function(value, key) {
            producto.producto_images.push({url: value});
        });
        if (brochure_preview === null) {
            alert('Seleccione un Brochure correcto');
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            return;
        }
        producto.brochure = brochure_preview;
        ProductosService.save(producto, function(data) {
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
    
    $scope.delete = function(img, cb) {
        var index = $scope.images.indexOf(img);
        $scope.images.splice(index, 1);
        $scope.urls_preview.splice(index, 1);
        if ($scope.images.length > 0) {
            $scope.methods.open(0);
        } else {
            $scope.methods.close();
        }
    };
    
    $scope.preview = function(images, errFiles) {
        $scope.loading = true;
        var fd = new FormData();
        $scope.images = [];
        
        angular.forEach(images, function(value, key) {
            fd.append('files[]', value);
        });
        
        ProductosService.preview(fd, function(data) {
            $scope.urls_preview = data.filenames;
            var title = 1;
            angular.forEach(data.filenames, function(value, key) {
                var image = {
                    url: tmp_path + value,
                    id: title,
                    deletable : true
                };
                
                $scope.images.push(image);
                title++;
            });
            $scope.loading = false;
            if (data.hasOwnProperty('message')) {
                if (data.message.type === 'error') {
                    alert(data.message.text);
                }
            }
        });
    };
    
    $scope.preview_brochure = function(brochure, errFiles) {
        $scope.loading = true;
        var fd = new FormData();
        fd.append('file', brochure);
        
        ProductosService.previewBrochure(fd, function(data) {
            if (data.message.type === 'success') {
                $scope.brochure_preview = data.filename;
            } else if (data.message.type === 'error') {
                $scope.brochure_preview = null;
            }
            $scope.loading = false;
        }, function(data) {
            $scope.brochure_preview = null;
            $scope.loading = false;
        });
    };
});