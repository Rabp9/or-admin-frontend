'use strict';

/**
 * @ngdoc overview
 * @name tuplastAdminApp
 * @description
 * # tuplastAdminApp
 *
 * Main module of the application.
 */
angular
.module('tuplastAdminApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ngFileUpload',
    'ui.tinymce',
    'ui.sortable',
    'thatisuday.ng-image-gallery',
    'angularValidator',
    'scrollable-table',
    'ngMap'
])
.config(["$routeProvider", "$httpProvider", function ($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('oauthHttpInterceptor');
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main',
            title: 'Home'
        })
        .when('/slider', {
            templateUrl: 'views/slider.html',
            controller: 'SliderCtrl',
            controllerAs: 'slider',
            title: 'Slider'
        })
        .when('/productos', {
            templateUrl: 'views/productos.html',
            controller: 'ProductosCtrl',
            controllerAs: 'productos',
            title: 'Productos'
        })
        .when('/nosotros', {
            templateUrl: 'views/nosotros.html',
            controller: 'NosotrosCtrl',
            controllerAs: 'nosotros',
            title: 'Nosotros'
        })
        .when('/obras', {
            templateUrl: 'views/obras.html',
            controller: 'ObrasCtrl',
            controllerAs: 'obras',
            title: 'Obras'
        })
        .when('/info-general', {
            templateUrl: 'views/info-general.html',
            controller: 'InfoGeneralCtrl',
            controllerAs: 'infoGeneral',
            title: 'Información General'
        })
        .when('/clientes', {
            templateUrl: 'views/clientes.html',
            controller: 'ClientesCtrl',
            controllerAs: 'clientes',
            title: 'Clientes'
        })
        .when('/convocatorias', {
            templateUrl: 'views/convocatorias.html',
            controller: 'ConvocatoriasCtrl',
            controllerAs: 'convocatorias',
            title: 'Convocatorias'
        })
        .when('/pages', {
            templateUrl: 'views/pages.html',
            controller: 'PagesCtrl',
            controllerAs: 'pages',
            title: 'Páginas'
        })
        .when('/tipo_sugerencias', {
            templateUrl: 'views/tipo_sugerencias.html',
            controller: 'TipoSugerenciasCtrl',
            controllerAs: 'tipoSugerencias',
            title: 'Tipos de Sugerencias'
        })
        .when('/roles', {
            templateUrl: 'views/roles.html',
            controller: 'RolesCtrl',
            controllerAs: 'roles',
            title: 'Roles'
        })
        .when('/users', {
            templateUrl: 'views/users.html',
            controller: 'UsersCtrl',
            controllerAs: 'users',
            title: 'Usuarios'
        })
        .when('/users-login', {
            templateUrl: 'views/users-login.html',
            controller: 'UsersLoginCtrl',
            controllerAs: 'usersLogin',
            title: 'Login'
        })
        .when('/asesorias', {
            templateUrl: 'views/asesorias.html',
            controller: 'AsesoriasCtrl',
            controllerAs: 'asesorias',
            title: 'Asesorías'
        })
        .otherwise({
            redirectTo: '/'
        });
}])
.run(["$rootScope", "$route", "$cookies", "$location", "UsersService", "$window", "EnvService", function($rootScope, $route, $cookies, $location, UsersService, $window, EnvService) {
    angular.module('tuplastAdminApp').path_location = EnvService.getHost();
    $rootScope.path_location = EnvService.getHost();
    
    $('#dvMessageRoot').removeClass('dvHidden');
    $rootScope.tinymceOptions = {
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | fontselect ",
        fontsize_formats: "8pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt",
        plugins: 'lists autolink textcolor colorpicker link media preview table code',
        language_url : '/scripts/langs_tinymce/es.js'
    };
    $('.nav a').on('click', function(){
        $('.navbar-toggle').click();
    });
    $rootScope.$route = $route;
    
    if ($cookies.get('tuplast-token')) {
        $rootScope.logged = true;
        $rootScope.user = $cookies.getObject('tuplast-user');
    } else {
        $rootScope.logged = false;
    }
    
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (current === undefined && next.$$route.controllerAs === 'usersLogin') {
            $('#topbar-wrapper').addClass('ng-hide');
            $('#wrapper').addClass('inLogin');
            if ($rootScope.user !== undefined) {
                $location.path('/');
            }
        } else if (current === undefined && next.$$route.controllerAs !== 'usersLogin') {
            $('#sidebar-wrapper').css('display', 'block');
            $('#wrapper').addClass('toggled');
            if ($rootScope.user === undefined) {
                $('#sidebar-wrapper').css('display', 'none');
                $('#wrapper').removeClass('toggled');
                $location.path('/users-login');
            }
        } else if (current.$$route.controllerAs !== 'usersLogin' && next.$$route.controllerAs === 'usersLogin') {
            if ($rootScope.user !== undefined) {
                $location.path('/');
            } else {
                $('#sidebar-wrapper').css('display', 'none');
                $('#wrapper').removeClass('toggled');
            }
        } else if (current.$$route.controllerAs === 'usersLogin' && next.$$route.controllerAs !== 'usersLogin') {
            if ($rootScope.user === undefined) {
                $location.path('/users-login');
            } else {
                $('#topbar-wrapper').removeClass('ng-hide');
                $('#sidebar-wrapper').css('display', 'block');
                $('#wrapper').addClass('toggled');
            }
        }
        if ($rootScope.user !== undefined) {
            if ($rootScope.user.rol.permisos.search(next.$$route.controllerAs) >= 0) {
                $rootScope.message_root = null;
            } else {
                if (next.$$route.controllerAs !== 'main' && next.$$route.controllerAs !== 'usersLogin') {
                    event.preventDefault();
                    $rootScope.message_root = {
                        type: 'error',
                        text: 'No tiene permisos'
                    };
                }
            }
        }
    });

    $rootScope.$on('$routeChangeSuccess', function(currentRoute, previousRoute) {
        $rootScope.title = $route.current.title;
    });

    $rootScope.$on('$routeChangeError', function() {
    });
    
    $rootScope.logout = function() {
        if (confirm('¿Está seguro de cerrar sesión?')) {
            $cookies.remove('tuplast-user');
            $cookies.remove('tuplast-token');
            $rootScope.user = undefined;
            $('#topbar-wrapper').addClass('ng-hide');
            $('#wrapper').addClass('inLogin');
            $rootScope.message_root = [];
            $location.path('/users-login');
        }
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('MainCtrl', function () {
    
});
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:SliderCtrl
 * @description
 * # SliderCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('SliderCtrl', ["$scope", "SlidesService", "$uibModal", function ($scope, SlidesService, $uibModal) {
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:SlidesAddCtrl
 * @description
 * # SlidesAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('SlidesAddCtrl', ["$scope", "$uibModalInstance", "SlidesService", function ($scope, $uibModalInstance, SlidesService) {
    $scope.slide = {};
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp'; 
    $scope.loading = false;
    $scope.slide.color_bg = '#74c15c';
    $scope.slide.color = '#ffffff';
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveSlide = function(slide, boton, url_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        if (url_preview === null) {
            alert('Seleccione una imagen correcta');
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            return;
        }
        slide.url = url_preview;
        SlidesService.save(slide, function(data) {
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
    
    $scope.preview = function(image, errFiles) {
        $scope.loading = true;
        var fd = new FormData();
        fd.append('file', image);
        
        SlidesService.preview(fd, function(data) {
            if (data.message.type === 'success') {
                $scope.url_preview = data.filename;
            } else if (data.message.type === 'error') {
                $scope.url_preview = null;
            }
            $scope.loading = false;
        }, function(data) {
            $scope.url_preview = null;
            $scope.loading = false;
        });
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:SlidesEditCtrl
 * @description
 * # SlidesEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('SlidesEditCtrl', ["$scope", "slide", "$uibModalInstance", "SlidesService", function ($scope, slide, $uibModalInstance, SlidesService) {
    $scope.slide = $.extend(true, {}, slide);
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'img/slides'; 
    $scope.url_preview = slide.url;
    $scope.loading = false;
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveSlide = function(slide, boton, url_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        if (url_preview === null) {
            alert('Seleccione una imagen correcta');
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            return;
        }
        slide.url = url_preview;
        SlidesService.save(slide, function(data) {
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
    
    $scope.preview = function(image, errFiles) {
        $scope.loading = true;
        $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp'; 
        var fd = new FormData();
        fd.append('file', image);
        
        SlidesService.preview(fd, function(data) {
            if (data.message.type === 'success') {
                $scope.url_preview = data.filename;
            } else if (data.message.type === 'error') {
                $scope.url_preview = null;
            }
            $scope.loading = false;
        }, function(data) {
            $scope.url_preview = null;
            $scope.loading = false;
        });
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ProductosCtrl
 * @description
 * # ProductosCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ProductosCtrl', ["$scope", "ProductosService", "$uibModal", function ($scope, ProductosService, $uibModal) {
    $scope.loading = true;
    ProductosService.getAdmin(function(data) {
        $scope.productos = data.productos;
        $scope.loading = false;
    });
    
    $scope.showProductosAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/productos-add.html',
            controller: 'ProductosAddCtrl',
            backdrop: false,
            size: 'lg'
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.productos.push(data.producto);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.showProductosEdit = function(producto, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/productos-edit.html',
            controller: 'ProductosEditCtrl',
            backdrop: false,
            size: 'lg',
            resolve: {
                producto: function() {
                    return producto;
                }
            }
        });
        
        modalInstanceEdit.result.then(function (data) {
            ProductosService.getAdmin(function(data) {
                $scope.productos = data.productos;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.removeProducto = function(cliente, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        if (confirm('¿Desea eliminar ese producto?')) {
            ProductosService.remove({id: cliente.id}, function(data) {
                $scope.message = data.message;
            });
        }
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ProductosAddCtrl
 * @description
 * # ProductosAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ProductosAddCtrl', ["$scope", "ProductosService", "$uibModalInstance", "PagesService", function ($scope, ProductosService, $uibModalInstance, PagesService) {
    $scope.producto = {};
    $scope.methods = {};
    var tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp' + '/';
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'img' + '/paginas/'; 
    $scope.loading = false;
    $scope.title_images = [];
    
    $scope.tinymceProductosOptions = {
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | fontselect ",
        fontsize_formats: "8pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt",
        plugins: 'lists autolink textcolor colorpicker link media preview table code image',
        language_url : '/scripts/langs_tinymce/es.js',
        file_browser_callback_types: 'image',
        file_browser_callback: function(field_name, url, type, win) {
            $scope.input = field_name;
            $('#flImagen').click();
        }
    };
    
    ProductosService.getTreeList({spacer: '_'}, function(data) {
        $scope.productos_list = data.productos;
    });
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveProducto = function(producto, boton, urls_preview, brochure_preview, title_images) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        producto.producto_images = [];
        angular.forEach(urls_preview, function(value, key) {
            producto.producto_images.push({
                url: value,
                title: title_images[key]
            });
        });
        if (brochure_preview !== null) {
            producto.brochure = brochure_preview;
        }
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
    
    $scope.upload = function(image, errFiles) {
        var fd = new FormData();
        fd.append('file', image);
        
        PagesService.upload(fd, function(data) {
            $scope.url = $scope.tmp_path + data.filename;
            document.getElementById($scope.input).value = $scope.url;
        });
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ProductosEditCtrl
 * @description
 * # ProductosEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ProductosEditCtrl', ["$scope", "producto", "$uibModalInstance", "ProductosService", "$q", "PagesService", function ($scope, producto, $uibModalInstance, 
    ProductosService, $q, PagesService) {
        
    $scope.loading = false;
    $scope.producto = {};
    var start = 0;
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'img' + '/paginas/'; 
    
    $scope.tinymceProductosOptions = {
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | fontselect ",
        fontsize_formats: "8pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt",
        plugins: 'lists autolink textcolor colorpicker link media preview table code image',
        language_url : '/scripts/langs_tinymce/es.js',
        file_browser_callback_types: 'image',
        file_browser_callback: function(field_name, url, type, win) {
            $scope.input = field_name;
            $('#flImagen').click();
        }
    };
    
    function getProductosList() {
        return $q(function(resolve, reject) {
            ProductosService.getTreeList({spacer: '_'}, function(data) {
                $scope.productos_list = data.productos;
                resolve($scope.productos_list);
            });
        });
    }
    
    getProductosList().then(function(productos_list) {
        ProductosService.get({id: producto.id}, function(data) {
            $scope.producto = data.producto;
            start = $scope.producto.producto_images.length;
            angular.forEach($scope.producto.producto_images, function(value, key) {
                $scope.images.push({
                    url: angular.module('tuplastAdminApp').path_location + 'img' + '/' + 'productos' + '/' + value.url,
                    id: value.id,
                    deletable : true,
                    title: value.title
                });
                $scope.title_images.push(value.title);
            });
            
            var k = -1;
            angular.forEach(productos_list, function(value, key) {
                if (parseInt(value.id) === parseInt($scope.producto.parent_id)) {
                    k = key;
                }
            });
            if (k !== -1) {
                $scope.producto.parent_id = productos_list[k].id;
            }
            
            $scope.brochure_preview = $scope.producto.brochure;
        });
    });
    
    $scope.images = [];
    $scope.methods = {};
    $scope.title_images = [];
    var tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp' + '/';
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveProducto = function(producto, boton, urls_preview, brochure_preview, title_images) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        angular.forEach(urls_preview, function(value, key) {
            console.log(title_images[start + key]);
            producto.producto_images.push({
                url: value,
                title: title_images[start + key]
            });
        });
        if (brochure_preview !== null) {
            producto.brochure = brochure_preview;
        }
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
        if (confirm('¿Està seguro de eliminar esta imagen?')) {
            var index = $scope.images.indexOf(img);
            ProductosService.deleteImage({id: img.id}, function(data) {
                $scope.images.splice(index, 1);
                $scope.title_images.splice(index, 1);
                angular.forEach($scope.producto.producto_images, function(value, key) {
                    if (value.id === img.id) {
                        $scope.producto.producto_images.splice(key, 1);
                    }
                });
                // $scope.urls_preview.splice(index, 1);
                if ($scope.images.length > 0) {
                    $scope.methods.open(0);
                } else {
                    $scope.methods.close();
                }
            });
        }
    };
    
    $scope.preview = function(images, errFiles) {
        $scope.loading = true;
        var fd = new FormData();
        
        angular.forEach(images, function(value, key) {
            fd.append('files[]', value);
        });
        
        ProductosService.preview(fd, function(data) {
            $scope.loading = true;
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
    
    $scope.upload = function(image, errFiles) {
        var fd = new FormData();
        fd.append('file', image);
        
        PagesService.upload(fd, function(data) {
            $scope.url = $scope.tmp_path + data.filename;
            document.getElementById($scope.input).value = $scope.url;
        });
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:NosotrosCtrl
 * @description
 * # NosotrosCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('NosotrosCtrl', ["$scope", "InfosService", "PoliticasService", "$uibModal", function ($scope, InfosService, PoliticasService, $uibModal) {
    $scope.quienesSomos = {};
    var dataSearch = ['nuestraHistoria', 'vision', 'mision', 'valor1', 'valor2', 'valor3',
        'valor4', 'valor5', 'valor6', 'valor7'
    ];
    
    $scope.loading = true;
    InfosService.getDataMany(dataSearch, function(data) {
        angular.forEach(dataSearch, function(value, key) {
            $scope.quienesSomos[value] = data.info[value];
        });
        $scope.loading = false;
    });
    
    PoliticasService.getAdmin(function(data) {
        $scope.politicas = data.politicas;
    });
    
    $scope.saveQuienesSomos = function(quienesSomos, boton) {
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        InfosService.saveMany(quienesSomos, function(data) {
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            
            $scope.message = data.message;
        }, function(data) {
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            $scope.message = {
                type: 'error',
                text: 'Hubo un error. Código: ' + data.status + ' Mensaje: ' + data.statusText
            };
        });
    };
    
    $scope.showPoliticasAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/politicas-add.html',
            controller: 'PoliticasAddCtrl',
            backdrop: false
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.politicas.push(data.politica);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.showPoliticasEdit = function(politica) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/politicas-edit.html',
            controller: 'PoliticasEditCtrl',
            backdrop: false,
            resolve: {
                politica: function() {
                    return politica;
                }
            }
        });
           
        modalInstanceEdit.result.then(function (data) {
            $scope.message = data.message;
            PoliticasService.getAdmin(function(data) {
                $scope.politicas = data.politicas;
            });
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:PoliticasAddCtrl
 * @description
 * # PoliticasAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('PoliticasAddCtrl', ["$scope", "PoliticasService", "$uibModalInstance", function ($scope, PoliticasService, $uibModalInstance) {
    $scope.politica = {};
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp'; 
    $scope.loading = false;
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.savePolitica = function(politica, boton, url_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        if (url_preview === null) {
            alert('Seleccione una imagen correcta');
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            return;
        }
        politica.url = url_preview;
        PoliticasService.save(politica, function(data) {
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
    
    $scope.preview = function(image, errFiles) {
        $scope.loading = true;
        var fd = new FormData();
        fd.append('file', image);
        
        PoliticasService.preview(fd, function(data) {
            if (data.message.type === 'success') {
                $scope.url_preview = data.filename;
            } else if (data.message.type === 'error') {
                $scope.url_preview = null;
            }
            $scope.loading = false;
        }, function(data) {
            $scope.url_preview = null;
            $scope.loading = false;
        });
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ObrasCtrl
 * @description
 * # ObrasCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ObrasCtrl', ["$scope", "ObrasService", "$uibModal", function ($scope, ObrasService, $uibModal) {
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ObrasAddCtrl
 * @description
 * # ObrasAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ObrasAddCtrl', ["$scope", "ObrasService", "$uibModalInstance", function ($scope, ObrasService, $uibModalInstance) {
    $scope.obra = {};
    $scope.methods = {};
    var tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp' + '/';
    $scope.loading = false;
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveObra = function(obra, boton, urls_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        obra.obra_images = [];
        angular.forEach(urls_preview, function(value, key) {
            obra.obra_images.push({url: value});
        });
        ObrasService.save(obra, function(data) {
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
        
        ObrasService.preview(fd, function(data) {
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ObrasEditCtrl
 * @description
 * # ObrasEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ObrasEditCtrl', ["$scope", "obra", "$uibModalInstance", "ObrasService", function ($scope, obra, $uibModalInstance, ObrasService) {
    $scope.loading = false;
    // $scope.obra = $.extend(true, {}, obra);
    ObrasService.get({id: obra.id}, function(data) {
        $scope.obra = data.obra;
        angular.forEach($scope.obra.obra_images, function(value, key) {
            $scope.images.push({
                url: angular.module('tuplastAdminApp').path_location + 'img' + '/' + 'obras' + '/' + value.url,
                id: value.id,
                deletable : true
            });
        });
    });
    
    $scope.images = [];
    $scope.methods = {};
    var tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp' + '/';
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveObra = function(obra, boton, urls_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        angular.forEach(urls_preview, function(value, key) {
            obra.obra_images.push({url: value});
        });
        ObrasService.save(obra, function(data) {
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
        if (confirm('¿Està seguro de eliminar esta imagen?')) {
            var index = $scope.images.indexOf(img);
            ObrasService.deleteImage({id: img.id}, function(data) {
                $scope.images.splice(index, 1);
                angular.forEach($scope.obra.obra_images, function(value, key) {
                    if (value.id === img.id) {
                        $scope.obra.obra_images.splice(key, 1);
                    }
                });
                // $scope.urls_preview.splice(index, 1);
                if ($scope.images.length > 0) {
                    $scope.methods.open(0);
                } else {
                    $scope.methods.close();
                }
            });
        }
    };
    
    $scope.preview = function(images, errFiles) {
        $scope.loading = true;
        var fd = new FormData();
        
        angular.forEach(images, function(value, key) {
            fd.append('files[]', value);
        });
        
        ObrasService.preview(fd, function(data) {
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
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.infosService
 * @description
 * # infosService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('InfosService', ["$resource", "EnvService", function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'infos/:id.json', {}, {
        saveMany: {
            method: 'POST',
            url: EnvService.getHost() + 'infos/saveMany.json',
        },
        getDataMany: {
            method: 'POST',
            url: EnvService.getHost() + 'infos/getDataMany.json',
        },
        getDataByData: {
            method: 'POST',
            url: EnvService.getHost() + 'infos/getDataByData.json',
        }
    });
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.slides
 * @description
 * # slides
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('SlidesService', ["$resource", "EnvService", function ($resource, EnvService) {
    return $resource(EnvService.getHost() + 'slides/:id.json', {}, {
        update: {
            method: 'PUT'
        },
        preview: {
            method: 'POST',
            url: EnvService.getHost() + 'slides/preview/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'slides/getAdmin/.json'
        },
        saveMany: {
            method: 'POST',
            url: EnvService.getHost() + 'slides/saveMany/.json'
        }
    });
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.productosService
 * @description
 * # productosService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('ProductosService', ["$resource", "EnvService", function ($resource, EnvService) {
    return $resource(EnvService.getHost() + 'productos/:id.json', {}, {
        preview: {
            method: 'POST',
            url: EnvService.getHost() + 'productos/preview/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'productos/getAdmin/.json'
        },
        deleteImage: {
            method: 'POST',
            url: EnvService.getHost() + 'productos/deleteImage/.json'
        },
        getTreeList: {
            method: 'GET',
            url: EnvService.getHost() + 'productos/getTreeList/:spacer.json'
        },
        previewBrochure: {
            method: 'POST',
            url: EnvService.getHost() + 'productos/previewBrochure/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        remove: {
            method: 'POST',
            url: EnvService.getHost() + 'productos/remove/.json'
        },
    });
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.politicas
 * @description
 * # politicas
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('PoliticasService', ["$resource", "EnvService", function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'politicas/:id.json', {}, {
        preview: {
            method: 'POST',
            url: EnvService.getHost() + 'politicas/preview/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'politicas/getAdmin/.json'
        }
    });
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.obrasService
 * @description
 * # obrasService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('ObrasService', ["$resource", "EnvService", function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'obras/:id.json', {}, {
        preview: {
            method: 'POST',
            url: EnvService.getHost() + 'obras/preview/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'obras/getAdmin/.json',       
        },
        deleteImage: {
            method: 'POST',
            url: EnvService.getHost() + 'obras/deleteImage/.json',
        }
    });
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:InfoGeneralCtrl
 * @description
 * # InfoGeneralCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('InfoGeneralCtrl', ["$scope", "InfosService", "$uibModal", function ($scope, InfosService, $uibModal) {
    var search = ['resumen_tuplast', 'mensaje_clientes_1', 'mensaje_clientes_2', 'facebook_link', 'linkedin_link', 'telf_oficina',
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:InfoGeneralEditCtrl
 * @description
 * # InfoGeneralEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('InfoGeneralEditCtrl', ["$scope", "info", "$uibModalInstance", "InfosService", function ($scope, info, $uibModalInstance, InfosService) {
    $scope.info = $.extend(true, {}, info);

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveInfoGeneral = function(info, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        InfosService.save(info, function(data) {
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ClientesCtrl
 * @description
 * # ClientesCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ClientesCtrl', ["$scope", "ClientesService", "$uibModal", function ($scope, ClientesService, $uibModal) {
    $scope.loading = true;
    ClientesService.getAdmin(function(data) {
        $scope.clientes = data.clientes;
        $scope.loading = false;
    });
    
    $scope.showClientesAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/clientes-add.html',
            controller: 'ClientesAddCtrl',
            backdrop: false,
            size: 'lg'
        });
        
        modalInstanceAdd.result.then(function (data) {
            if (data.cliente) {
                $scope.clientes.push(data.cliente);
            }
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    
    $scope.showClientesEdit = function(cliente, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/clientes-edit.html',
            controller: 'ClientesEditCtrl',
            backdrop: false,
            resolve: {
                cliente: function() {
                    return cliente;
                }
            },
            size: 'lg'
        });
           
        modalInstanceEdit.result.then(function (data) {
            ClientesService.getAdmin(function(data) {
                $scope.clientes = data.clientes;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ClientesAddCtrl
 * @description
 * # ClientesAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ClientesAddCtrl', ["$scope", "$uibModalInstance", "ClientesService", "NgMap", function ($scope, $uibModalInstance, ClientesService, NgMap) {
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ClientesEditCtrl
 * @description
 * # ClientesEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ClientesEditCtrl', ["$scope", "cliente", "$uibModalInstance", "ClientesService", "NgMap", function ($scope, cliente, $uibModalInstance, ClientesService, NgMap) {
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
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.clientesService
 * @description
 * # clientesService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('ClientesService', ["$resource", "EnvService", function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'clientes/:id.json', {}, {
        preview: {
            method: 'POST',
            url: EnvService.getHost() + 'clientes/preview/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'clientes/getAdmin/.json',
        }
    });
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.clientesService
 * @description
 * # clientesService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('ClientesService', ["$resource", "EnvService", function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'clientes/:id.json', {}, {
        preview: {
            method: 'POST',
            url: EnvService.getHost() + 'clientes/preview/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'clientes/getAdmin/.json',
        }
    });
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ConvocatoriasCtrl
 * @description
 * # ConvocatoriasCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ConvocatoriasCtrl', ["$scope", "ConvocatoriasService", "$uibModal", function ($scope, ConvocatoriasService, $uibModal) {
    $scope.loading = true;
    ConvocatoriasService.getAdmin(function(data) {
        $scope.convocatorias = data.convocatorias;
        $scope.loading = false;
    });
    
    $scope.showConvocatoriasAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/convocatorias-add.html',
            controller: 'ConvocatoriasAddCtrl',
            backdrop: false
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.convocatorias.push(data.convocatoria);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    
    $scope.showConvocatoriasEdit = function(convocatoria, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/convocatorias-edit.html',
            controller: 'ConvocatoriasEditCtrl',
            backdrop: false,
            resolve: {
                convocatoria: function() {
                    return convocatoria;
                }
            }
        });
           
        modalInstanceEdit.result.then(function (data) {
            ConvocatoriasService.getAdmin(function(data) {
                $scope.convocatorias = data.convocatorias;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ConvocatoriasAddCtrl
 * @description
 * # ConvocatoriasAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ConvocatoriasAddCtrl', ["$scope", "$uibModalInstance", "ConvocatoriasService", function ($scope, $uibModalInstance, ConvocatoriasService) {
    $scope.convocatoria = {};
    $scope.loading = false;
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveConvocatoria = function(convocatoria, boton, documentacion_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        if (documentacion_preview === null) {
            alert('Seleccione un documento correcto');
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            return;
        }
        convocatoria.fecha = formatDate($scope.fecha_pre);
        convocatoria.documentacion = documentacion_preview;
        ConvocatoriasService.save(convocatoria, function(data) {
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
    
    $scope.preview = function(documentacion, errFiles) {
        $scope.loading = true;
        var fd = new FormData();
        fd.append('file', documentacion);
        
        ConvocatoriasService.preview(fd, function(data) {
            if (data.message.type === 'success') {
                $scope.documentacion_preview = data.filename;
            } else if (data.message.type === 'error') {
                $scope.documentacion_preview = null;
            }
            $scope.loading = false;
        }, function(data) {
            $scope.documentacion_preview = null;
            $scope.loading = false;
        });
    };
    
    function formatDate(fecha) {
        if (fecha === undefined) {
            return undefined;
        }
        return fecha.getFullYear() + '-' + str_pad((fecha.getMonth() + 1), '00') + '-' + str_pad(fecha.getDate(), '00');
    }
    
    function str_pad(str, pad) {
        return pad.substring(0, (pad.length - str.toString().length)) + str;
    }
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:ConvocatoriasEditCtrl
 * @description
 * # ConvocatoriasEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('ConvocatoriasEditCtrl', ["$scope", "convocatoria", "$uibModalInstance", "ConvocatoriasService", function ($scope, convocatoria, $uibModalInstance, ConvocatoriasService) {
    $scope.convocatoria = $.extend(true, {}, convocatoria);
    $scope.documentacion_preview = $scope.convocatoria.documentacion;
    $scope.loading = false;
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveConvocatoria = function(convocatoria, boton, documentacion_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        if (documentacion_preview === null) {
            alert('Seleccione una documento correcto');
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            return;
        }
        
        convocatoria.fecha = formatDate($scope.fecha_pre);
        convocatoria.documentacion = documentacion_preview;
        
        ConvocatoriasService.save(convocatoria, function(data) {
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
    
    $scope.preview = function(documentacion, errFiles) {
        $scope.loading = true;
        var fd = new FormData();
        fd.append('file', documentacion);
        
        ConvocatoriasService.preview(fd, function(data) {
            if (data.message.type === 'success') {
                $scope.documentacion_preview = data.filename;
            } else if (data.message.type === 'error') {
                $scope.documentacion_preview = null;
            }
            $scope.loading = false;
        }, function(data) {
            $scope.documentacion_preview = null;
            $scope.loading = false;
        });
    };
    
    function formatDate(fecha) {
        if (fecha === undefined) {
            return undefined;
        }
        return fecha.getFullYear() + '-' + str_pad((fecha.getMonth() + 1), '00') + '-' + str_pad(fecha.getDate(), '00');
    }
    
    function str_pad(str, pad) {
        return pad.substring(0, (pad.length - str.toString().length)) + str;
    }
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.convocatoriasService
 * @description
 * # convocatoriasService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('ConvocatoriasService', ["$resource", "EnvService", function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'convocatorias/:id.json', {}, {
        preview: {
            method: 'POST',
            url: EnvService.getHost() + 'convocatorias/preview/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'convocatorias/getAdmin/.json',        
        }
    });
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:PagesCtrl
 * @description
 * # PagesCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('PagesCtrl', ["$scope", "PagesService", "$uibModal", function ($scope, PagesService, $uibModal) {
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:PagesAddCtrl
 * @description
 * # PagesAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('PagesAddCtrl', ["$scope", "$uibModalInstance", "PagesService", function ($scope, $uibModalInstance, PagesService) {
    $scope.page = {};
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'img' + '/paginas/'; 
    $scope.menus = [
        {id: 'NS', description: 'Nosotros'},
        {id: 'PY', description: 'Proyectos'}, 
        {id: 'CN', description: 'Contáctanos'}
    ];
    
    $scope.tinymcePagesOptions = {
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | fontselect ",
        fontsize_formats: "8pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt",
        plugins: 'lists autolink textcolor colorpicker link media preview table code image',
        language_url : '/scripts/langs_tinymce/es.js',
        file_browser_callback_types: 'image',
        file_browser_callback: function(field_name, url, type, win) {
            $scope.input = field_name;
            $('#flImagen').click();
        }
    };
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.savePage = function(page, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        PagesService.save(page, function(data) {
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
    
    $scope.upload = function(image, errFiles) {
        var fd = new FormData();
        fd.append('file', image);
        
        PagesService.upload(fd, function(data) {
            $scope.url = $scope.tmp_path + data.filename;
            document.getElementById($scope.input).value = $scope.url;
        });
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:PagesEditCtrl
 * @description
 * # PagesEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('PagesEditCtrl', ["$scope", "page", "$uibModalInstance", "PagesService", function ($scope, page, $uibModalInstance, PagesService) {
    $scope.page = $.extend(true, {}, page);
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'img' + '/paginas/'; 
    $scope.menus = [
        {id: 'NS', description: 'Nosotros'},
        {id: 'PY', description: 'Proyectos'}, 
        {id: 'CN', description: 'Contáctanos'}
    ];
    
    $scope.tinymcePagesOptions = {
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | fontselect ",
        fontsize_formats: "8pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt",
        plugins: 'lists autolink textcolor colorpicker link media preview table code image',
        language_url : '/scripts/langs_tinymce/es.js',
        file_browser_callback_types: 'image',
        file_browser_callback: function(field_name, url, type, win) {
            $scope.input = field_name;
            $('#flImagen').click();
        }
    };
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.savePage = function(page, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        PagesService.save(page, function(data) {
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
    
    $scope.upload = function(image, errFiles) {
        var fd = new FormData();
        fd.append('file', image);
        
        PagesService.upload(fd, function(data) {
            $scope.url = $scope.tmp_path + data.filename;
            document.getElementById($scope.input).value = $scope.url;
        });
    };
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.pagesService
 * @description
 * # pagesService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('PagesService', ["$resource", "EnvService", function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'pages/:id.json', {}, {
        upload: {
            method: 'POST',
            url: EnvService.getHost() + 'pages/upload/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'pages/getAdmin/.json'
        }
    });
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:TipoSugerenciasCtrl
 * @description
 * # TipoSugerenciasCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('TipoSugerenciasCtrl', ["$scope", "TipoSugerenciasService", "$uibModal", function ($scope, TipoSugerenciasService, $uibModal) {
    $scope.loading = true;
    TipoSugerenciasService.getAdmin(function(data) {
        $scope.tipo_sugerencias = data.tipo_sugerencias;
        $scope.loading = false;
    });
    
    $scope.showTipoSugerenciasAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/tipo_sugerencias-add.html',
            controller: 'TipoSugerenciasAddCtrl',
            backdrop: false
        });
        
        modalInstanceAdd.result.then(function (data) {
            console.log(data);
            $scope.tipo_sugerencias.push(data.tipo_sugerencia);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    
    $scope.showTipoSugerenciasEdit = function(tipo_sugerencia, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/tipo_sugerencias-edit.html',
            controller: 'TipoSugerenciasEditCtrl',
            backdrop: false,
            resolve: {
                tipo_sugerencia: function() {
                    return tipo_sugerencia;
                }
            }
        });
           
        modalInstanceEdit.result.then(function (data) {
            TipoSugerenciasService.getAdmin(function(data) {
                $scope.tipo_sugerencias = data.tipo_sugerencias;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:TipoSugerenciasAddCtrl
 * @description
 * # TipoSugerenciasAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('TipoSugerenciasAddCtrl', ["$scope", "$uibModalInstance", "TipoSugerenciasService", function ($scope, $uibModalInstance, TipoSugerenciasService) {
    $scope.tipo_sugerencia = {};
    $scope.tipo_sugerencia.detalle_sugerencias = [];
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.addEmail = function(email_nuevo) {
        $scope.tipo_sugerencia.detalle_sugerencias.push({
            email: email_nuevo
        });
        $scope.email_nuevo = '';
    };
    
    $scope.removeEmail = function(detalle_sugerencia) {
        var index = $scope.tipo_sugerencia.detalle_sugerencias.indexOf(detalle_sugerencia);
        $scope.tipo_sugerencia.detalle_sugerencias.splice(index, 1);
    };

    $scope.saveTipoSugerencia = function(tipo_sugerencia, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        TipoSugerenciasService.save(tipo_sugerencia, function(data) {
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:TipoSugerenciasEditCtrl
 * @description
 * # TipoSugerenciasEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('TipoSugerenciasEditCtrl', ["$scope", "tipo_sugerencia", "$uibModalInstance", "TipoSugerenciasService", function ($scope, tipo_sugerencia, $uibModalInstance, TipoSugerenciasService) {
    $scope.tipo_sugerencia = $.extend(true, {}, tipo_sugerencia);
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.addEmail = function(email_nuevo) {
        $scope.tipo_sugerencia.detalle_sugerencias.push({
            email: email_nuevo
        });
        $scope.email_nuevo = '';
    };
    
    $scope.removeEmail = function(detalle_sugerencia) {
        if (confirm('¿Està seguro de eliminar este email?')) {
            TipoSugerenciasService.removeDetalle({
                detalle_sugerencia_id: detalle_sugerencia.id
            }, function(data){
                var index = $scope.tipo_sugerencia.detalle_sugerencias.indexOf(detalle_sugerencia);
                $scope.tipo_sugerencia.detalle_sugerencias.splice(index, 1);
            }, function(err){
                
            });
        }
    };

    $scope.saveTipoSugerencia = function(tipo_sugerencia, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        TipoSugerenciasService.save(tipo_sugerencia, function(data) {
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
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.TipoSugerenciasService
 * @description
 * # TipoSugerenciasService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('TipoSugerenciasService', ["$resource", "EnvService", function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'tipo_sugerencias/:id.json', {}, {
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'tipo_sugerencias/getAdmin/.json',
        },
        removeDetalle: {
            method: 'POST',
            url: EnvService.getHost() + 'tipo_sugerencias/removeDetalle/.json',
        }
    });
}]);
'use strict';

/**
 * @ngdoc filter
 * @name tuplastAdminApp.filter:menuFilter
 * @function
 * @description
 * # menuFilter
 * Filter in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.filter('menuFilter', function () {
    return function (menu) {
        switch (menu) {
            case 'IN':
                return 'Inicio';
            case 'NS':
                return 'Nosotros';
            case 'PD':
                return 'Productos';
            case 'CL':
                return 'Clientes';
            case 'PY':
                return 'Proyectos';
            case 'CN':
                return 'Contáctanos';
        }
    };
});
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:PoliticasEditCtrl
 * @description
 * # PoliticasEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('PoliticasEditCtrl', ["$scope", "politica", "$uibModalInstance", "PoliticasService", function ($scope, politica, $uibModalInstance, PoliticasService) {
    $scope.politica = $.extend(true, {}, politica);
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'img/politicas'; 
    $scope.url_preview = politica.url;
    $scope.loading = false;
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.savePolitica = function(politica, boton, url_preview) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        if (url_preview === null) {
            alert('Seleccione una imagen correcta');
            $('#' + boton).removeClass('disabled');
            $('#' + boton).prop('disabled', false);
            return;
        }
        politica.url = url_preview;
        PoliticasService.save(politica, function(data) {
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
    
    $scope.preview = function(image, errFiles) {
        $scope.loading = true;
        $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'tmp'; 
        var fd = new FormData();
        fd.append('file', image);
        
        PoliticasService.preview(fd, function(data) {
            if (data.message.type === 'success') {
                $scope.url_preview = data.filename;
            } else if (data.message.type === 'error') {
                $scope.url_preview = null;
            }
            $scope.loading = false;
        }, function(data) {
            $scope.url_preview = null;
            $scope.loading = false;
        });
    };
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.pagesService
 * @description
 * # pagesService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('PagesService', ["$resource", "EnvService", function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'pages/:id.json', {}, {
        upload: {
            method: 'POST',
            url: EnvService.getHost() + 'pages/upload/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'pages/getAdmin/.json'
        }
    });
}]);
'use strict';

/**
 * @ngdoc filter
 * @name tuplastAdminApp.filter:tipoProducto
 * @function
 * @description
 * # tipoProducto
 * Filter in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.filter('tipoProducto', function () {
    return function (tipo) {
        switch(tipo) {
            case 'P':
                return 'Página';
            case 'A':
                return 'Area';
            case 'L':
                return 'Línea de Producto';
        }
    };
});
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:RolesCtrl
 * @description
 * # RolesCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('RolesCtrl', ["$scope", "RolesService", "$uibModal", function ($scope, RolesService, $uibModal) {
    $scope.loading = true;
    RolesService.getAdmin(function(data) {
        $scope.roles = data.roles;
        $scope.loading = false;
    });
    
    $scope.showRolesAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/roles-add.html',
            controller: 'RolesAddCtrl',
            backdrop: false
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.roles.push(data.rol);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.showRolesEdit = function(rol, event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/roles-edit.html',
            controller: 'RolesEditCtrl',
            backdrop: false,
            resolve: {
                rol: function() {
                    return rol;
                }
            }
        });
        
        modalInstanceEdit.result.then(function (data) {
            RolesService.getAdmin(function(data) {
                $scope.roles = data.roles;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('UsersCtrl', ["$scope", "UsersService", "$uibModal", function ($scope, UsersService, $uibModal) {
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:RolesAddCtrl
 * @description
 * # RolesAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('RolesAddCtrl', ["$scope", "RolesService", "$uibModalInstance", "ControllersService", function ($scope, RolesService, $uibModalInstance, ControllersService) {
    $scope.rol = {};
    $scope.rol.controller_roles = [];
    
    $scope.loading = true;
    ControllersService.get(function(data) {
        $scope.rol.controller_roles = [];
        angular.forEach(data.controllers, function(value, key) {
            $scope.rol.controller_roles.push({
                controller_id: value.id,
                controller: value,
                permiso: false
            });
        });
        $scope.loading = false;
    });
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveRol = function(rol, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        RolesService.save(rol, function(data) {
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:RolesEditCtrl
 * @description
 * # RolesEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('RolesEditCtrl', ["$scope", "rol", "$uibModalInstance", "RolesService", function ($scope, rol, $uibModalInstance, RolesService) {
    $scope.rol = $.extend(true, {}, rol);
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveRol = function(rol, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        RolesService.save(rol, function(data) {
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:UsersAddCtrl
 * @description
 * # UsersAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('UsersAddCtrl', ["$scope", "UsersService", "RolesService", "$uibModalInstance", function ($scope, UsersService, RolesService, $uibModalInstance) {
    $scope.user = {};
    
    $scope.loading = true;
    RolesService.get(function(data) {
        $scope.roles = data.roles;
        $scope.loading = false;
    });
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveUser = function(user, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        UsersService.save(user, function(data) {
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
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:UsersEditCtrl
 * @description
 * # UsersEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('UsersEditCtrl', ["$scope", "user", "$uibModalInstance", "UsersService", "RolesService", function ($scope, user, $uibModalInstance, UsersService, RolesService) {
    $scope.user = $.extend(true, {}, user);
    $scope.loading = true;
    
    RolesService.get(function(data) {
        $scope.roles = data.roles;
        $scope.loading = false;
    });
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveUser = function(user, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        UsersService.save(user, function(data) {
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
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.rolesService
 * @description
 * # rolesService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('RolesService', ["$resource", "EnvService", function ($resource, EnvService) {
    return $resource(EnvService.getHost() + 'roles/:id.json', {}, {
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'roles/getAdmin/.json',
        }
    });
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.usersService
 * @description
 * # usersService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('UsersService', ["$resource", "EnvService", function ($resource, EnvService) {
    return $resource(EnvService.getHost() + 'users/:id.json', {}, {
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'users/getAdmin/.json',
        },
        login: {
            method: 'POST',
            url: EnvService.getHost() + 'users/token/.json',
        }
    });
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.controllersService
 * @description
 * # controllersService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('ControllersService', ["$resource", "EnvService", function ($resource, EnvService) {
    return $resource(EnvService.getHost() + 'controllers/:id.json', {});
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:UsersLoginCtrl
 * @description
 * # UsersLoginCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('UsersLoginCtrl', ["$scope", "UsersService", "$uibModal", "$cookies", "$location", "$rootScope", function ($scope, UsersService, $uibModal, $cookies, $location, $rootScope) {
    
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
    
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.oauthHttpInterceptor
 * @description
 * # oauthHttpInterceptor
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('oauthHttpInterceptor', ["$cookies", function ($cookies) {
    return {
        request: function (config) {
            config.headers.Authorization = 'Bearer ' + $cookies.get('tuplast-token');
            return config;
        }
    };
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.envService
 * @description
 * # envService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('EnvService', function () {
    return {
        getHost: function() {
            switch (window.location.hostname) {
                case 'localhost':
                    return 'http://localhost:8000/or-backend/';
                case 'admin.tuplast.robertobocanegra.com':
                    return 'http://tuplast.robertobocanegra.com/api/';
            }
        }
    };
});
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:AsesoriasCtrl
 * @description
 * # AsesoriasCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('AsesoriasCtrl', ["$scope", "AsesoriasService", "$uibModal", function ($scope, AsesoriasService, $uibModal) {
    $scope.loading = true;
    
    AsesoriasService.getAdmin(function(data) {
        $scope.asesorias = data.asesorias;
        $scope.loading = false;
    });
    
    $scope.showAsesoriasAdd = function(event) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceAdd = $uibModal.open({
            templateUrl: 'views/asesorias-add.html',
            controller: 'AsesoriasAddCtrl',
            backdrop: false,
            size: 'lg'
        });
        
        modalInstanceAdd.result.then(function (data) {
            $scope.asesorias.push(data.asesoria);
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
    
    $scope.showAsesoriasEdit = function(asesoria) {
        $(event.currentTarget).addClass('disabled');
        $(event.currentTarget).prop('disabled', true);
        
        var modalInstanceEdit = $uibModal.open({
            templateUrl: 'views/asesorias-edit.html',
            controller: 'AsesoriasEditCtrl',
            backdrop: false,
            size: 'lg',
            resolve: {
                asesoria: function() {
                    return asesoria;
                }
            }
        });
        
        modalInstanceEdit.result.then(function (data) {
            AsesoriasService.getAdmin(function(data) {
                $scope.asesorias = data.asesorias;
            });
            $scope.message = data.message;
        });
        
        $(event.currentTarget).removeClass('disabled');
        $(event.currentTarget).prop('disabled', false);
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:AsesoriasAddCtrl
 * @description
 * # AsesoriasAddCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('AsesoriasAddCtrl', ["$scope", "$uibModalInstance", "AsesoriasService", function ($scope, $uibModalInstance, AsesoriasService) {
    $scope.asesoria = {};
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'img' + '/asesorias/'; 
    
    $scope.tinymceAsesoriasOptions = {
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | fontselect ",
        fontsize_formats: "8pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt",
        plugins: 'lists autolink textcolor colorpicker link media preview table code image',
        language_url : '/scripts/langs_tinymce/es.js',
        file_browser_callback_types: 'image',
        file_browser_callback: function(field_name, url, type, win) {
            $scope.input = field_name;
            $('#flImagen').click();
        }
    };
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveAsesoria = function(asesoria, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        AsesoriasService.save(asesoria, function(data) {
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
    
    $scope.upload = function(image, errFiles) {
        var fd = new FormData();
        fd.append('file', image);
        
        AsesoriasService.upload(fd, function(data) {
            $scope.url = $scope.tmp_path + data.filename;
            document.getElementById($scope.input).value = $scope.url;
        });
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name tuplastAdminApp.controller:AsesoriasEditCtrl
 * @description
 * # AsesoriasEditCtrl
 * Controller of the tuplastAdminApp
 */
angular.module('tuplastAdminApp')
.controller('AsesoriasEditCtrl', ["$scope", "asesoria", "$uibModalInstance", "AsesoriasService", function ($scope, asesoria, $uibModalInstance, AsesoriasService) {
    $scope.asesoria = $.extend(true, {}, asesoria);
    $scope.tmp_path = angular.module('tuplastAdminApp').path_location + 'img' + '/asesorias/'; 
    
    $scope.tinymceAsesoriasOptions = {
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | fontselect ",
        fontsize_formats: "8pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt",
        plugins: 'lists autolink textcolor colorpicker link media preview table code image',
        language_url : '/scripts/langs_tinymce/es.js',
        file_browser_callback_types: 'image',
        file_browser_callback: function(field_name, url, type, win) {
            $scope.input = field_name;
            $('#flImagen').click();
        }
    };
    
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveAsesoria = function(asesoria, boton) {
        $('#' + boton).text('Guardando...');
        $('#' + boton).addClass('disabled');
        $('#' + boton).prop('disabled', true);
        
        AsesoriasService.save(asesoria, function(data) {
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
    
    $scope.upload = function(image, errFiles) {
        var fd = new FormData();
        fd.append('file', image);
        
        AsesoriasService.upload(fd, function(data) {
            $scope.url = $scope.tmp_path + data.filename;
            document.getElementById($scope.input).value = $scope.url;
        });
    };
}]);
'use strict';

/**
 * @ngdoc service
 * @name tuplastAdminApp.asesoriasService
 * @description
 * # asesoriasService
 * Factory in the tuplastAdminApp.
 */
angular.module('tuplastAdminApp')
.factory('AsesoriasService', ["$resource", "EnvService", function($resource, EnvService) {
    return $resource(EnvService.getHost() + 'asesorias/:id.json', {}, {
        upload: {
            method: 'POST',
            url: EnvService.getHost() + 'asesorias/upload/.json',
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        },
        getAdmin: {
            method: 'GET',
            url: EnvService.getHost() + 'asesorias/getAdmin/.json'
        }
    });
}]);
angular.module('tuplastAdminApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/asesorias-add.html',
    "<form ng-submit=\"saveAsesoria(asesoria, 'btnSaveAsesoria')\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Nueva Asesoría</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"form-group\"> <label for=\"txtTitle\">Título</label> <input id=\"txtTitle\" class=\"form-control\" type=\"text\" ng-model=\"asesoria.title\" required> </div> <div class=\"form-group\"> <label for=\"txtaBody\">Contenido</label> <textarea id=\"txtaBody\" class=\"form-control\" ng-model=\"asesoria.body\" ui-tinymce=\"tinymceAsesoriasOptions\" style=\"height: 250px\"></textarea> <input style=\"display: none\" id=\"flImagen\" type=\"file\" class=\"form-control\" ngf-select=\"upload($file, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> </div> <div class=\"form-group\"> <label for=\"txtaResumen\">Resumen</label> <textarea id=\"txtaResumen\" class=\"form-control\" ng-model=\"asesoria.resumen\" ui-tinymce=\"tinymceAsesoriasOptions\" style=\"height: 400px\"></textarea> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveAsesoria\" class=\"btn btn-success\" type=\"submit\">Guardar Asesoría</button> </div> </form>"
  );


  $templateCache.put('views/asesorias-edit.html',
    "<form ng-submit=\"saveAsesoria(asesoria, 'btnSaveAsesoria')\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Modificar Asesoría</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"form-group\"> <label for=\"txtTitle\">Título</label> <input id=\"txtTitle\" class=\"form-control\" type=\"text\" ng-model=\"asesoria.title\" required> </div> <div class=\"form-group\"> <label for=\"txtaBody\">Contenido</label> <textarea id=\"txtaBody\" class=\"form-control\" ng-model=\"asesoria.body\" ui-tinymce=\"tinymceAsesoriasOptions\" style=\"height: 400px\"></textarea> <input style=\"display: none\" id=\"flImagen\" type=\"file\" class=\"form-control\" ngf-select=\"upload($file, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> </div> <div class=\"form-group\"> <label for=\"txtaResumen\">Resumen</label> <textarea id=\"txtaResumen\" class=\"form-control\" ng-model=\"asesoria.resumen\" ui-tinymce=\"tinymceAsesoriasOptions\" style=\"height: 400px\"></textarea> </div> <div class=\"form-group\"> <label>Estado</label> <div> <label><input type=\"radio\" ng-model=\"asesoria.estado_id\" ng-value=\"1\"> Activo</label> <label><input type=\"radio\" ng-model=\"asesoria.estado_id\" ng-value=\"2\"> Inactivo</label> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveAsesoria\" class=\"btn btn-success\" type=\"submit\">Guardar Asesoría</button> </div> </form>"
  );


  $templateCache.put('views/asesorias.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Asesorías</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Asesorías</h2> <hr> <div class=\"row\"> <div class=\"col-sm-10 col-sm-offset-1\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"showAsesoriasAdd($event)\"><span class=\"glyphicon glyphicon-plus\"></span> Nueva Asesoría</button> <scrollable-table watch=\"asesorias\" class=\"table-responsive\"> <table class=\"table table-striped\"> <thead> <tr> <th sortable-header col=\"id\">Código</th> <th sortable-header col=\"title\">Título</th> <th>Acciones</th> </tr> </thead> <tbody> <tr ng-hide=\"!loading\"><td colspan=\"3\">Cargando...</td></tr> <tr ng-show=\"!loading && asesorias.length === 0\"><td colspan=\"3\">No hay registros</td></tr> <tr ng-hide=\"loading\" ng-class=\"{'danger': asesoria.estado_id === 2}\" ng-repeat=\"asesoria in asesorias\" row-id=\"{{ asesoria.id }}\"> <td>{{ asesoria.id }}</td> <td>{{ asesoria.title }}</td> <td><button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"showAsesoriasEdit(asesoria, $event)\"><span class=\"glyphicon glyphicon-pencil\"></span></button></td> </tr> </tbody> </table> </scrollable-table> </div> </div>"
  );


  $templateCache.put('views/clientes-add.html',
    "<form ng-submit=\"saveCliente(cliente, 'btnSaveCliente')\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Nuevo Cliente</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"form-group\"> <label for=\"txtRazonSocial\">Razón Social</label> <input id=\"txtRazonSocial\" class=\"form-control\" type=\"text\" ng-model=\"cliente.razon_social\" required> </div> <div class=\"form-group\"> <label for=\"txtCiudad\">Ciudad</label> <input id=\"txtCiudad\" class=\"form-control\" type=\"text\" ng-model=\"cliente.ciudad\" required> </div> <div class=\"form-group\"> <label>Ubicación</label> <div map-lazy-load=\"https://maps.google.com/maps/api/js\" map-lazy-load-params=\"{{ googleMapsUrl }}\"> <ng-map center=\"-8.1103401, -79.01554\" zoom=\"13\" on-click=\"setMarker()\"> <marker position=\"{{cliente.latitud}}, {{cliente.longitud}}\"> </marker></ng-map> </div> </div> <div class=\"form-group\"> <label for=\"txtRubro\">Rubro</label> <input id=\"txtRubro\" class=\"form-control\" type=\"text\" ng-model=\"cliente.rubro\" required> </div> <div class=\"form-group\"> <label for=\"txtRuc\">RUC</label> <input id=\"txtRuc\" class=\"form-control\" type=\"text\" ng-model=\"cliente.ruc\" required pattern=\"[0-9]{11}\" maxlength=\"11\"> <p class=\"help-block\">Ingrese un número de 11 digitos.</p> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveCliente\" class=\"btn btn-success\" type=\"submit\">Guardar Cliente</button> </div> </form>"
  );


  $templateCache.put('views/clientes-edit.html',
    "<form ng-submit=\"saveCliente(cliente, 'btnSaveCliente')\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Modificar Cliente</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"form-group\"> <label for=\"txtRazonSocial\">Razón Social</label> <input id=\"txtRazonSocial\" class=\"form-control\" type=\"text\" ng-model=\"cliente.razon_social\" required> </div> <div class=\"form-group\"> <label for=\"txtCiudad\">Ciudad</label> <input id=\"txtCiudad\" class=\"form-control\" type=\"text\" ng-model=\"cliente.ciudad\" required> </div> <div class=\"form-group\"> <label>Ubicación</label> <div map-lazy-load=\"https://maps.google.com/maps/api/js\" map-lazy-load-params=\"{{ googleMapsUrl }}\"> <ng-map center=\"{{lat_def}}, {{long_def}}\" zoom=\"13\" on-click=\"setMarker()\"> <marker position=\"{{cliente.latitud}}, {{cliente.longitud}}\"> </marker></ng-map> </div> </div> <div class=\"form-group\"> <label for=\"txtRubro\">Rubro</label> <input id=\"txtRubro\" class=\"form-control\" type=\"text\" ng-model=\"cliente.rubro\" required> </div> <div class=\"form-group\"> <label for=\"txtRuc\">RUC</label> <input id=\"txtRuc\" class=\"form-control\" type=\"text\" ng-model=\"cliente.ruc\" required pattern=\"[0-9]{11}\" maxlength=\"11\"> <p class=\"help-block\">Ingrese un número de 11 digitos.</p> </div> <div class=\"form-group\"> <label>Estado</label> <div> <label><input type=\"radio\" ng-model=\"cliente.estado_id\" ng-value=\"1\"> Activo</label> <label><input type=\"radio\" ng-model=\"cliente.estado_id\" ng-value=\"2\"> Inactivo</label> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveCliente\" class=\"btn btn-success\" type=\"submit\">Guardar Cliente</button> </div> </form>"
  );


  $templateCache.put('views/clientes.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Clientes</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Clientes</h2> <hr> <div class=\"row\"> <div class=\"col-sm-10 col-sm-offset-1\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"showClientesAdd($event)\"><span class=\"glyphicon glyphicon-plus\"></span> Nuevo Cliente</button> <scrollable-table watch=\"clientes\" class=\"table-responsive\"> <table class=\"table table-striped\"> <thead> <tr> <th sortable-header col=\"id\">Código</th> <th sortable-header col=\"razon_social\">Razón Social</th> <th sortable-header col=\"ciudad\">Ciudad</th> <th sortable-header col=\"rubro\">Rubro</th> <th sortable-header col=\"ruc\">RUC</th> <th>Acciones</th> </tr> </thead> <tbody> <tr ng-hide=\"!loading\"><td colspan=\"5\">Cargando...</td></tr> <tr ng-show=\"loading && clientes.length === 0\"><td colspan=\"5\">No hay registros</td></tr> <tr ng-class=\"{'danger': cliente.estado_id === 2}\" ng-repeat=\"cliente in clientes\" row-id=\"{{ cliente.id }}\"> <td>{{ cliente.id }}</td> <td>{{ cliente.razon_social }}</td> <td>{{ cliente.ciudad }}</td> <td>{{ cliente.rubro }}</td> <td>{{ cliente.ruc }}</td> <td> <button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"showClientesEdit(cliente, $event)\"><span class=\"glyphicon glyphicon-pencil\"></span></button> </td> </tr> </tbody> </table> </scrollable-table> </div> </div>"
  );


  $templateCache.put('views/convocatorias-add.html',
    "<form ng-submit=\"saveConvocatoria(convocatoria, 'btnSaveConvocatoria', documentacion_preview)\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Nueva Convocatoria</h4> </div> <div class=\"modal-body\"> <div class=\"form-group\"> <label for=\"txtDescripcion\">Descripción</label> <input id=\"txtDescripcion\" class=\"form-control\" type=\"text\" ng-model=\"convocatoria.descripcion\" required> </div> <div class=\"form-group\"> <label for=\"dtFecha\">Fecha</label> <input id=\"dtFecha\" class=\"form-control\" type=\"date\" ng-model=\"fecha_pre\" required> </div> <div class=\"form-group\"> <label for=\"flDocumentacion\">Documentación</label> <input id=\"flDocumentacion\" type=\"file\" class=\"form-control\" ngf-select=\"preview($file, $invalidFiles)\" accept=\"application/pdf\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\" required> <span ng-hide=\"documentacion_preview === undefined || documentacion_preview === null\">Documento cargado correctamente</span> <span ng-show=\"loading\">Cargando...</span> <span ng-show=\"!loading && documentacion_preview === null\">No fue posible cargar el documento</span> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveConvocatoria\" class=\"btn btn-success\" type=\"submit\">Guardar Política</button> </div> </form>"
  );


  $templateCache.put('views/convocatorias-edit.html',
    "<form ng-submit=\"saveConvocatoria(convocatoria, 'btnSaveConvocatoria', documentacion_preview)\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Editar Convocatoria</h4> </div> <div class=\"modal-body\"> <div class=\"form-group\"> <label for=\"txtDescripcion\">Descripción</label> <input id=\"txtDescripcion\" class=\"form-control\" type=\"text\" ng-model=\"convocatoria.descripcion\" required> </div> <div class=\"form-group\"> <label for=\"dtFecha\">Fecha</label> <input id=\"dtFecha\" class=\"form-control\" type=\"date\" ng-model=\"fecha_pre\" required ng-value=\"convocatoria.fecha\"> </div> <div class=\"form-group\"> <label for=\"flDocumentacion\">Documentación</label> <input id=\"flDocumentacion\" type=\"file\" class=\"form-control\" ngf-select=\"preview($file, $invalidFiles)\" accept=\"application/pdf\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> <span ng-hide=\"documentacion_preview === undefined || documentacion_preview === null\">Documento cargado correctamente<br></span> <span ng-show=\"loading\">Cargando...</span> <span ng-show=\"!loading && documentacion_preview === null\">No fue posible cargar el documento</span> </div> Link de Descarga <a ng-href=\"{{path_location + 'convocatorias/download/' + convocatoria.id }}\" target=\"_blank\"><span class=\"glyphicon glyphicon-list-alt\"></span></a> <div class=\"form-group\"> <label>Estado</label> <div> <label><input type=\"radio\" ng-model=\"convocatoria.estado_id\" ng-value=\"1\"> Activo</label> <label><input type=\"radio\" ng-model=\"convocatoria.estado_id\" ng-value=\"2\"> Inactivo</label> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveConvocatoria\" class=\"btn btn-success\" type=\"submit\">Guardar Convocatoria</button> </div> </form>"
  );


  $templateCache.put('views/convocatorias.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Convocatorias</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Convocatorias</h2> <hr> <div class=\"row\"> <div class=\"col-sm-10 col-sm-offset-1\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"showConvocatoriasAdd($event)\"><span class=\"glyphicon glyphicon-plus\"></span> Nueva Convocatoria</button> <scrollable-table watch=\"convocatorias\" class=\"table-responsive\"> <table class=\"table table-striped\"> <thead> <tr> <th sortable-header col=\"id\">Código</th> <th sortable-header col=\"descripcion\">Descripción</th> <th sortable-header col=\"fecha\">Fecha</th> <th>Acciones</th> </tr> </thead> <tbody> <tr ng-hide=\"!loading\"><td colspan=\"5\">Cargando...</td></tr> <tr ng-show=\"!loading && convocatorias.length === 0\"><td colspan=\"5\">No hay registros</td></tr> <tr ng-class=\"{'danget': convocatoria.estado_id === 2}\" ng-repeat=\"convocatoria in convocatorias\" row-id=\"{{ convocatoria.id }}\"> <td>{{ convocatoria.id }}</td> <td>{{ convocatoria.descripcion }}</td> <td>{{ convocatoria.fecha }}</td> <td><button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"showConvocatoriasEdit(convocatoria, $event)\"><span class=\"glyphicon glyphicon-pencil\"></span></button></td> </tr> </tbody> </table> </scrollable-table> </div> </div>"
  );


  $templateCache.put('views/info-general-edit.html',
    "<form novalidate angular-validator angular-validator-submit=\"saveInfoGeneral(info, 'btnSaveInfo')\" name=\"infoGenerealEdit\" angular-validator-quiet> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Modificar Información</h4> </div> <div class=\"modal-body\"> <div class=\"form-group\"> <label for=\"txtData\">Data</label> <input id=\"txtData\" class=\"form-control\" type=\"text\" ng-model=\"info.data\" readonly> </div> <div class=\"form-group\"> <label for=\"txtaValor\">Valor</label> <textarea style=\"height: 200px\" id=\"txtaValor\" class=\"form-control\" ng-model=\"info.value\" name=\"infoValue\" required required-message=\"'Este campo es requerido'\" validate-on=\"blur\">\n" +
    "            </textarea> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveInfo\" class=\"btn btn-success\" type=\"submit\">Guardar Info</button> </div> </form>"
  );


  $templateCache.put('views/info-general.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Información General</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Información General</h2> <hr> <div class=\"row\"> <div class=\"col-sm-10 col-sm-offset-1\"> <scrollable-table watch=\"infos\" class=\"table-responsive\"> <table class=\"table table-striped\"> <thead> <tr> <th sortable-header col=\"data\">Dato</th> <th sortable-header col=\"value\">Contenido</th> <th>Acciones</th> </tr> </thead> <tbody> <tr ng-hide=\"!loading\"><td colspan=\"5\">Cargando...</td></tr> <tr ng-show=\"!loading && infos.length === 0\"><td colspan=\"5\">No hay registros</td></tr> <tr ng-repeat=\"info in infos\" row-id=\"{{ info.data }}\"> <td>{{ info.data }}</td> <td>{{ info.value | limitTo: 50 }}<span ng-if=\"info.value.length > 50\">...</span></td> <td><button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"showInfosEdit(info, $event)\"><span class=\"glyphicon glyphicon-pencil\"></span></button></td> </tr> </tbody> </table> </scrollable-table> </div> </div>"
  );


  $templateCache.put('views/main.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#/\">Inicio</a></li> </ol> <h2 class=\"header-link-main\">Inicio</h2> <hr> <div class=\"row\"> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Información General</h2> </div> <a ng-href=\"#/info-general\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Slider</h2> </div> <a ng-href=\"#/slider\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Nosotros</h2> </div> <a ng-href=\"#/nosotros\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Productos</h2> </div> <a ng-href=\"#/productos\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Clientes</h2> </div> <a ng-href=\"#/clientes\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Obras</h2> </div> <a ng-href=\"#/obras\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Páginas</h2> </div> <a ng-href=\"#/pages\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Convocatorias</h2> </div> <a ng-href=\"#/convocatorias\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Tipos de Sugerencias</h2> </div> <a ng-href=\"#/tipo_sugerencias\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Asesorías</h2> </div> <a ng-href=\"#/asesorias\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Roles</h2> </div> <a ng-href=\"#/roles\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> <div class=\"col-lg-3 col-md-6\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2 class=\"header-link-main\">Usuarios</h2> </div> <a ng-href=\"#/users\"> <div class=\"panel-footer\"> <span class=\"pull-left\">Ver detalles</span> <span class=\"pull-right\"> <span class=\"glyphicon glyphicon-arrow-right\"></span> </span> <div class=\"clearfix\"></div> </div> </a> </div> </div> </div>"
  );


  $templateCache.put('views/nosotros.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Nosotros</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Nosotros</h2> <hr> <div> <!-- Nav tabs --> <ul class=\"nav nav-tabs\" role=\"tablist\"> <li role=\"presentation\" class=\"active\" style=\"cursor: default\"> <a data-target=\"#quienes-somos\" aria-controls=\"quienes-somos\" role=\"tab\" data-toggle=\"tab\"><h3>¿Quiénes somos?</h3></a> </li> <li role=\"presentation\" class=\"li-nosotros\"> <a data-target=\"#politicas\" aria-controls=\"politicas\" role=\"tab\" data-toggle=\"tab\"><h3>Políticas</h3></a> </li> </ul> <!-- Tab panes --> <div class=\"tab-content\"> <div role=\"tabpanel\" class=\"tab-pane active\" id=\"quienes-somos\"> <div class=\"row\"> <div class=\"col-sm-12\"> <form ng-submit=\"saveQuienesSomos(quienesSomos, 'btnSaveQuienesSomos')\"> <div class=\"form-group\"> <label for=\"txtaNuestraHistoria\">Nuestra Historia</label> <textarea id=\"txtaNuestraHistoria\" class=\"form-control\" ui-tinymce=\"tinymceOptions\" ng-model=\"quienesSomos.nuestraHistoria\"></textarea> </div> <div class=\"form-group\"> <label for=\"txtaVision\">Valores</label> <input type=\"text\" class=\"form-control\" ng-model=\"quienesSomos.valor1\"> <input type=\"text\" class=\"form-control\" ng-model=\"quienesSomos.valor2\"> <input type=\"text\" class=\"form-control\" ng-model=\"quienesSomos.valor3\"> <input type=\"text\" class=\"form-control\" ng-model=\"quienesSomos.valor4\"> <input type=\"text\" class=\"form-control\" ng-model=\"quienesSomos.valor5\"> <input type=\"text\" class=\"form-control\" ng-model=\"quienesSomos.valor6\"> <input type=\"text\" class=\"form-control\" ng-model=\"quienesSomos.valor7\"> </div> <div class=\"form-group\"> <label for=\"txtaVision\">Visión</label> <textarea id=\"txtaVision\" class=\"form-control\" ui-tinymce=\"tinymceOptions\" ng-model=\"quienesSomos.vision\"></textarea> </div> <div class=\"form-group\"> <label for=\"txtaMision\">Misión</label> <textarea id=\"txtaMision\" class=\"form-control\" ui-tinymce=\"tinymceOptions\" ng-model=\"quienesSomos.mision\"></textarea> </div> <button id=\"btnSaveQuienesSomos\" class=\"btn btn-primary pull-right\"><span class=\"glyphicon glyphicon-ok\"></span> Guardar</button> </form> </div> </div> </div> <div role=\"tabpanel\" class=\"tab-pane\" id=\"politicas\"> <div class=\"row\"> <div class=\"col-sm-12\"> <button class=\"btn btn-primary\" ng-click=\"showPoliticasAdd($event)\"><span class=\"glyphicon glyphicon-plus\"></span> Nueva Politica</button> <scrollable-table watch=\"politicas\" class=\"table-responsive\"> <table class=\"table table-striped\"> <thead> <tr> <th sortable-header col=\"id\">Código</th> <th sortable-header col=\"title\">Título</th> <th>Acciones</th> </tr> </thead> <tbody> <tr ng-class=\"{'danger': politica.estado_id === 2}\" ng-repeat=\"politica in politicas\" row-id=\"{{ politica.id }}\"> <td>{{ politica.id }}</td> <td>{{ politica.title }}</td> <td><button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"showPoliticasEdit(politica, $event)\"><span class=\"glyphicon glyphicon-pencil\"></span></button></td> </tr> </tbody> </table> </scrollable-table> </div> </div> </div> </div> </div>"
  );


  $templateCache.put('views/obras-add.html',
    "<form ng-submit=\"saveObra(obra, 'btnSaveObra', urls_preview)\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Nueva Obra</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"form-group\"> <label for=\"txtTitle\">Título</label> <input id=\"txtTitle\" class=\"form-control\" type=\"text\" ng-model=\"obra.title\" required> </div> <div class=\"form-group\"> <label for=\"txtaBody\">Contenido</label> <textarea id=\"txtaBody\" class=\"form-control textarea-3x\" ng-model=\"obra.body\" ui-tinymce=\"tinymceOptions\"></textarea> </div> <div class=\"form-group\"> <label for=\"txtaResumen\">Resumen</label> <textarea id=\"txtaResumen\" class=\"form-control textarea-2x\" ng-model=\"obra.resumen\" required></textarea> </div> <div class=\"form-group\"> <label for=\"flImagenesObras\">Imágenes</label> <input id=\"flImagenesObras\" type=\"file\" class=\"form-control\" required ngf-multiple=\"true\" ngf-select=\"preview($files, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> <span ng-show=\"loading\">Cargando...</span> <div ng-image-gallery images=\"images\" on-delete=\"delete(img, cb)\" methods=\"methods\"> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveObra\" class=\"btn btn-success\" type=\"submit\">Guardar Obra</button> </div> </form>"
  );


  $templateCache.put('views/obras-edit.html',
    "<form ng-submit=\"saveObra(obra, 'btnSaveObra', urls_preview)\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Modificar Obra</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"form-group\"> <label for=\"txtTitle\">Título</label> <input id=\"txtTitle\" class=\"form-control\" type=\"text\" ng-model=\"obra.title\" required> </div> <div class=\"form-group\"> <label for=\"txtaBody\">Contenido</label> <textarea id=\"txtaBody\" class=\"form-control textarea-3x\" ng-model=\"obra.body\" ui-tinymce=\"tinymceOptions\"></textarea> </div> <div class=\"form-group\"> <label for=\"txtaResumen\">Resumen</label> <textarea id=\"txtaResumen\" class=\"form-control textarea-2x\" ng-model=\"obra.resumen\" required></textarea> </div> <div class=\"form-group\"> <label for=\"flImagenesObras\">Imágenes</label> <input id=\"flImagenesObras\" type=\"file\" class=\"form-control\" ngf-multiple=\"true\" ngf-select=\"preview($files, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> <span ng-show=\"loading\">Cargando...</span> <div ng-image-gallery images=\"images\" on-delete=\"delete(img, cb)\" methods=\"methods\"> </div> </div> <div class=\"form-group\"> <label>Estado</label> <div> <label><input type=\"radio\" ng-model=\"obra.estado_id\" ng-value=\"1\"> Activo</label> <label><input type=\"radio\" ng-model=\"obra.estado_id\" ng-value=\"2\"> Inactivo</label> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveObra\" class=\"btn btn-success\" type=\"submit\">Guardar Obra</button> </div> </form>"
  );


  $templateCache.put('views/obras.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Obras</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Obras</h2> <hr> <div class=\"row\"> <div class=\"col-sm-10 col-sm-offset-1\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"showObrasAdd($event)\"><span class=\"glyphicon glyphicon-plus\"></span> Nueva Obra</button> <scrollable-table watch=\"obras\" class=\"table-responsive\"> <table class=\"table table-striped\"> <thead> <tr> <th sortable-header col=\"id\">Código</th> <th sortable-header col=\"title\">Título</th> <th>Acciones</th> </tr> </thead> <tbody> <tr ng-hide=\"!loading\"><td colspan=\"3\">Cargando...</td></tr> <tr ng-show=\"!loading && obras.length === 0\"><td colspan=\"3\">No hay registros</td></tr> <tr ng-hide=\"loading\" ng-class=\"{'danger': obra.estado_id === 2}\" ng-repeat=\"obra in obras\" row-id=\"{{ obra.id }}\"> <td>{{ obra.id }}</td> <td>{{ obra.title }}</td> <td><button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"showObrasEdit(obra, $event)\"><span class=\"glyphicon glyphicon-pencil\"></span></button></td> </tr> </tbody> </table> </scrollable-table> </div> </div>"
  );


  $templateCache.put('views/pages-add.html',
    "<form ng-submit=\"savePage(page, 'btnSavePage')\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Nueva Pàgina</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"row\"> <div class=\"col-sm-8\"> <div class=\"form-group\"> <label for=\"txtTitle\">Título</label> <input id=\"txtTitle\" class=\"form-control\" type=\"text\" ng-model=\"page.title\" required> </div> </div> <div class=\"col-sm-4\"> <div class=\"form-group\"> <label for=\"sltMenu\">Menú</label> <select class=\"form-control\" id=\"sltMenu\" required ng-options=\"menu.id as menu.description for menu in menus\" ng-model=\"page.menu\"> <option value=\"\">Selecciona uno</option> </select> </div> </div> </div> <div class=\"form-group\"> <label for=\"txtaBody\">Contenido</label> <textarea id=\"txtaBody\" class=\"form-control\" ng-model=\"page.body\" ui-tinymce=\"tinymcePagesOptions\" style=\"height: 250px\"></textarea> <input style=\"display: none\" id=\"flImagen\" type=\"file\" class=\"form-control\" ngf-select=\"upload($file, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSavePage\" class=\"btn btn-success\" type=\"submit\">Guardar Página</button> </div> </form>"
  );


  $templateCache.put('views/pages-edit.html',
    "<form ng-submit=\"savePage(page, 'btnSavePage')\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Modificar Página</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"row\"> <div class=\"col-sm-8\"> <div class=\"form-group\"> <label for=\"txtTitle\">Título</label> <input id=\"txtTitle\" class=\"form-control\" type=\"text\" ng-model=\"page.title\" required> </div> </div> <div class=\"col-sm-4\"> <div class=\"form-group\"> <label for=\"sltMenu\">Menú</label> <select class=\"form-control\" id=\"sltMenu\" required ng-options=\"menu.id as menu.description for menu in menus\" ng-model=\"page.menu\"> <option value=\"\">Selecciona uno</option> </select> </div> </div> </div> <div class=\"form-group\"> <label for=\"txtaBody\">Contenido</label> <textarea id=\"txtaBody\" class=\"form-control\" ng-model=\"page.body\" ui-tinymce=\"tinymcePagesOptions\" style=\"height: 400px\"></textarea> <input style=\"display: none\" id=\"flImagen\" type=\"file\" class=\"form-control\" ngf-select=\"upload($file, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> </div> <div class=\"form-group\"> <label>Estado</label> <div> <label><input type=\"radio\" ng-model=\"page.estado_id\" ng-value=\"1\"> Activo</label> <label><input type=\"radio\" ng-model=\"page.estado_id\" ng-value=\"2\"> Inactivo</label> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSavePage\" class=\"btn btn-success\" type=\"submit\">Guardar Página</button> </div> </form>"
  );


  $templateCache.put('views/pages.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Páginas</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Páginas</h2> <hr> <div class=\"row\"> <div class=\"col-sm-10 col-sm-offset-1\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"showPagesAdd($event)\"><span class=\"glyphicon glyphicon-plus\"></span> Nueva Página</button> <scrollable-table watch=\"pages\" class=\"table-responsive\"> <table class=\"table table-striped\"> <thead> <tr> <th sortable-header col=\"id\">Código</th> <th sortable-header col=\"title\">Título</th> <th sortable-header col=\"menu\">Menú</th> <th>Acciones</th> </tr> </thead> <tbody> <tr ng-hide=\"!loading\"><td colspan=\"5\">Cargando...</td></tr> <tr ng-show=\"!loading && pages.length === 0\"><td colspan=\"5\">No hay registros</td></tr> <tr ng-class=\"{'danger': page.estado_id === 2}\" ng-repeat=\"page in pages\" row-id=\"{{ page.id }}\"> <td>{{ page.id }}</td> <td>{{ page.title }}</td> <td>{{ page.menu | menuFilter }}</td> <td><button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"showPagesEdit(page, $event)\"><span class=\"glyphicon glyphicon-pencil\"></span></button></td> </tr> </tbody> </table> </scrollable-table> </div> </div>"
  );


  $templateCache.put('views/politicas-add.html',
    "<form ng-submit=\"savePolitica(politica, 'btnSavePolitica', url_preview)\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Nueva Política</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"form-group\"> <label for=\"txtTitle\">Título</label> <input id=\"txtTitle\" class=\"form-control\" type=\"text\" ng-model=\"politica.title\" required> </div> <div class=\"form-group\"> <label for=\"txtaBody\">Contenido</label> <textarea id=\"txtaBody\" class=\"form-control\" ng-model=\"politica.body\" ui-tinymce=\"tinymceOptions\"></textarea> </div> <div class=\"form-group\"> <label for=\"flImagen\">Imagen</label> <input id=\"flImagen\" type=\"file\" class=\"form-control\" ngf-select=\"preview($file, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\" required> <img ng-hide=\"url_preview === undefined || url_preview === null\" class=\"img-responsive\" ng-src=\"{{tmp_path}}/{{url_preview}}\" alt=\"imagen previa\"> <span ng-show=\"loading\">Cargando...</span> <span ng-show=\"!loading && url_preview === null\">No fue posible cargar la imagen</span> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSavePolitica\" class=\"btn btn-success\" type=\"submit\">Guardar Política</button> </div> </form>"
  );


  $templateCache.put('views/politicas-edit.html',
    "<form ng-submit=\"savePolitica(politica, 'btnSavePolitica', url_preview)\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Editar Política</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"form-group\"> <label for=\"txtTitle\">Título</label> <input id=\"txtTitle\" class=\"form-control\" type=\"text\" ng-model=\"politica.title\" required> </div> <div class=\"form-group\"> <label for=\"txtaBody\">Contenido</label> <textarea id=\"txtaBody\" class=\"form-control\" ng-model=\"politica.body\" ui-tinymce=\"tinymceOptions\"></textarea> </div> <div class=\"form-group\"> <label for=\"flImagen\">Imagen</label> <input id=\"flImagen\" type=\"file\" class=\"form-control\" ngf-select=\"preview($file, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> <img ng-hide=\"url_preview === undefined || url_preview === null\" class=\"img-responsive\" ng-src=\"{{tmp_path}}/{{url_preview}}\" alt=\"imagen previa\"> <span ng-show=\"loading\">Cargando...</span> <span ng-show=\"!loading && url_preview === null\">No fue posible cargar la imagen</span> </div> <div class=\"form-group\"> <label>Estado</label> <div> <label><input type=\"radio\" ng-model=\"politica.estado_id\" ng-value=\"1\"> Activo</label> <label><input type=\"radio\" ng-model=\"politica.estado_id\" ng-value=\"2\"> Inactivo</label> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSavePolitica\" class=\"btn btn-success\" type=\"submit\">Guardar Politica</button> </div> </form>"
  );


  $templateCache.put('views/productos-add.html',
    "<form ng-submit=\"saveProducto(producto, 'btnSaveProducto', urls_preview, brochure_preview, title_images)\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Nuevo Producto</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"row\"> <div class=\"col-sm-4\"> <div class=\"form-group\"> <label for=\"txtTitle\">Título</label> <input id=\"txtTitle\" class=\"form-control\" type=\"text\" ng-model=\"producto.title\" required> </div> </div> <div class=\"col-sm-3\"> <div class=\"form-group\"> <label for=\"txtSubtitle\">Sub Título</label> <input id=\"txtSubtitle\" class=\"form-control\" type=\"text\" ng-model=\"producto.subtitle\"> </div> </div> <div class=\"col-sm-2\"> <div class=\"form-group\"> <label for=\"sltTipo\">Tipo</label> <select id=\"sltTipo\" class=\"form-control\" required ng-options=\"option.type as option.description for option in [{type: 'P', description: 'Página'}, {type: 'L', description: 'Línea de Producto'}, {type: 'A', description: 'Área'}]\" ng-model=\"producto.type\"> <option value=\"\">Selecciona uno</option> </select> </div> </div> <div class=\"col-sm-3\"> <div class=\"form-group\"> <label for=\"sltParent\">Pertenece a</label> <select id=\"sltParent\" class=\"form-control\" ng-options=\"producto.id as producto.title for producto in productos_list\" ng-model=\"producto.parent_id\"> <option value=\"\">Selecciona uno</option> </select> </div> </div> </div> <div class=\"form-group\"> <label for=\"txtaBody\">Contenido</label> <textarea id=\"txtaBody\" class=\"form-control textarea-3x\" ng-model=\"producto.body\" ui-tinymce=\"tinymceProductosOptions\"></textarea> <input style=\"display: none\" id=\"flImagen\" type=\"file\" class=\"form-control\" ngf-select=\"upload($file, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> </div> <div class=\"form-group\"> <label for=\"txtaResumen\">Resumen</label> <textarea id=\"txtaResumen\" class=\"form-control textarea-2x\" ng-model=\"producto.resumen\" required></textarea> </div> <div class=\"form-group\"> <label for=\"flImagenesProductos\">Imágenes</label> <input id=\"flImagenesProductos\" type=\"file\" class=\"form-control\" ngf-multiple=\"true\" ngf-select=\"preview($files, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> <span ng-show=\"loading\">Cargando...</span> <div ng-image-gallery images=\"images\" on-delete=\"delete(img, cb)\" methods=\"methods\"> </div> <input class=\"form-control\" type=\"text\" placeholder=\"Tìtulo de Imagen {{ $index + 1 }}\" ng-repeat=\"image in images\" ng-model=\"title_images[$index]\"> </div> <div class=\"form-group\"> <label for=\"flBrochure\">Brochure</label> <input id=\"flBrochure\" type=\"file\" class=\"form-control\" ngf-select=\"preview_brochure($file, $invalidFiles)\" accept=\"application/pdf\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> <span ng-hide=\"brochure_preview === undefined || brochure_preview === null\">Brochure cargado correctamente</span> <span ng-show=\"loading\">Cargando...</span> <span ng-show=\"!loading && brochure_preview === null\">No fue posible cargar el Brochure</span> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveProducto\" class=\"btn btn-success\" type=\"submit\">Guardar Producto</button> </div> </form>"
  );


  $templateCache.put('views/productos-edit.html',
    "<form ng-submit=\"saveProducto(producto, 'btnSaveProducto', urls_preview, brochure_preview, title_images)\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Modificar Producto</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"row\"> <div class=\"col-sm-4\"> <div class=\"form-group\"> <label for=\"txtTitle\">Título</label> <input id=\"txtTitle\" class=\"form-control\" type=\"text\" ng-model=\"producto.title\" required> </div> </div> <div class=\"col-sm-3\"> <div class=\"form-group\"> <label for=\"txtSubtitle\">Sub Título</label> <input id=\"txtSubtitle\" class=\"form-control\" type=\"text\" ng-model=\"producto.subtitle\"> </div> </div> <div class=\"col-sm-2\"> <div class=\"form-group\"> <label for=\"sltTipo\">Tipo</label> <select id=\"sltTipo\" class=\"form-control\" required ng-options=\"option.type as option.description for option in [{type: 'P', description: 'Página'}, {type: 'L', description: 'Línea de Producto'}, {type: 'A', description: 'Área'}]\" ng-model=\"producto.type\"> <option value=\"\">Selecciona uno</option> </select> </div> </div> <div class=\"col-sm-3\"> <div class=\"form-group\"> <label for=\"sltParent\">Pertenece a</label> <select id=\"sltParent\" class=\"form-control\" ng-options=\"producto.id as producto.title for producto in productos_list\" ng-model=\"producto.parent_id\"> <option value=\"\">Selecciona uno</option> </select> </div> </div> </div> <div class=\"form-group\"> <label for=\"txtaBody\">Contenido</label> <textarea id=\"txtaBody\" class=\"form-control textarea-3x\" ng-model=\"producto.body\" ui-tinymce=\"tinymceProductosOptions\"></textarea> <input style=\"display: none\" id=\"flImagen\" type=\"file\" class=\"form-control\" ngf-select=\"upload($file, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> </div> <div class=\"form-group\"> <label for=\"txtaResumen\">Resumen</label> <textarea id=\"txtaResumen\" class=\"form-control textarea-2x\" ng-model=\"producto.resumen\" required></textarea> </div> <div class=\"form-group\"> <label for=\"flImagenesProductos\">Imágenes</label> <input id=\"flImagenesProductos\" type=\"file\" class=\"form-control\" ngf-multiple=\"true\" ngf-select=\"preview($files, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> <span ng-show=\"loading\">Cargando...</span> <div ng-image-gallery images=\"images\" on-delete=\"delete(img, cb)\" methods=\"methods\"> </div> <input class=\"form-control\" type=\"text\" placeholder=\"Tìtulo de Imagen {{ $index + 1 }}\" ng-repeat=\"image in images\" ng-model=\"title_images[$index]\" ng-readonly=\"{{ image.title !== undefined }}\"> </div> <div class=\"form-group\"> <label for=\"flBrochure\">Brochure</label> <input id=\"flBrochure\" type=\"file\" class=\"form-control\" ngf-select=\"preview_brochure($file, $invalidFiles)\" accept=\"application/pdf\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> <span ng-hide=\"brochure_preview === undefined || brochure_preview === null\">Brochure cargado correctamente<br></span> <span ng-show=\"loading\">Cargando...</span> <span ng-show=\"!loading && brochure_preview === null\">No fue posible cargar el Brochure</span> </div> <div ng-show=\"!loading && brochure_preview !== null\">Link de Descarga <a ng-href=\"{{path_location + 'productos/download/' + producto.id }}\" target=\"_blank\"><span class=\"glyphicon glyphicon-list-alt\"></span></a> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveProducto\" class=\"btn btn-success\" type=\"submit\">Guardar Producto</button> </div> </form>"
  );


  $templateCache.put('views/productos.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Productos</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Productos</h2> <hr> <div class=\"row\"> <div class=\"col-sm-10 col-sm-offset-1\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"showProductosAdd($event)\"><span class=\"glyphicon glyphicon-plus\"></span> Nuevo Producto</button> <scrollable-table watch=\"productos\" class=\"table-responsive\"> <table class=\"table table-striped\"> <thead> <tr> <th sortable-header col=\"id\">Código</th> <th sortable-header col=\"title\">Título</th> <th sortable-header col=\"type\">Tipo</th> <th>Acciones</th> </tr> </thead> <tbody> <tr ng-hide=\"!loading\"><td colspan=\"5\">Cargando...</td></tr> <tr ng-show=\"!loading && productos.length === 0\"><td colspan=\"5\">No hay registros</td></tr> <tr ng-class=\"{'danger': producto.estado_id === 2}\" ng-repeat=\"producto in productos\" row-id=\"{{ producto.id }}\"> <td>{{ producto.id }}</td> <td>{{ producto.title }}</td> <td>{{ producto.type | tipoProducto }}</td> <td> <button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"showProductosEdit(producto, $event)\"><span class=\"glyphicon glyphicon-pencil\"></span></button> <button type=\"button\" class=\"btn btn-warning btn-sm\" ng-click=\"removeProducto(producto, $event)\"><span class=\"glyphicon glyphicon-remove\"></span></button> </td> </tr> </tbody> </table> </scrollable-table> </div> </div>"
  );


  $templateCache.put('views/roles-add.html',
    "<form novalidate angular-validator angular-validator-submit=\"saveRol(rol, 'btnSaveRol')\" name=\"rolesAdd\" angular-validator-quiet> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Nuevo Rol</h4> </div> <div class=\"modal-body\"> <div class=\"form-group\"> <label for=\"txtDescripcion\">Descripción</label> <input id=\"txtDescripcion\" class=\"form-control\" type=\"text\" ng-model=\"rol.descripcion\" required name=\"rolDescripcion\" required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> </div> <p>Con acceso a:</p> <span ng-show=\"loading\">Cargando...</span> <div class=\"form-group\"> <div class=\"row\"> <div class=\"col-sm-4\" ng-repeat=\"controller_rol in rol.controller_roles\"> <label><input type=\"checkbox\" ng-model=\"controller_rol.permiso\"> {{ controller_rol.controller.descripcion }}</label> </div> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveRol\" class=\"btn btn-success\" type=\"submit\">Guardar Rol</button> </div> </form>"
  );


  $templateCache.put('views/roles-edit.html',
    "<form novalidate angular-validator angular-validator-submit=\"saveRol(rol, 'btnSaveRol')\" name=\"rolesEdit\" angular-validator-quiet> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Modificar Rol</h4> </div> <div class=\"modal-body\"> <div class=\"form-group\"> <label for=\"txtDescripcion\">Descripción</label> <input id=\"txtDescripcion\" class=\"form-control\" type=\"text\" ng-model=\"rol.descripcion\" required name=\"rolDescripcion\" required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> </div> <p>Con acceso a:</p> <div class=\"form-group\"> <div class=\"row\"> <div class=\"col-sm-4\" ng-repeat=\"controller_rol in rol.controller_roles\"> <label><input type=\"checkbox\" ng-model=\"controller_rol.permiso\"> {{ controller_rol.controller.descripcion }}</label> </div> </div> </div> <div class=\"form-group\"> <label>Estado</label> <div> <label><input type=\"radio\" ng-model=\"rol.estado_id\" ng-value=\"1\"> Activo</label> <label><input type=\"radio\" ng-model=\"rol.estado_id\" ng-value=\"2\"> Inactivo</label> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveRol\" class=\"btn btn-success\" type=\"submit\">Guardar Rol</button> </div> </form>"
  );


  $templateCache.put('views/roles.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Roles</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Roles</h2> <hr> <div class=\"row\"> <div class=\"col-sm-10 col-sm-offset-1\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"showRolesAdd($event)\"><span class=\"glyphicon glyphicon-plus\"></span> Nuevo Rol</button> <scrollable-table watch=\"roles\" class=\"table-responsive\"> <table class=\"table table-striped\"> <thead> <tr> <th sortable-header col=\"id\">Código</th> <th sortable-header col=\"descripcion\">Descripción</th> <th>Acciones</th> </tr> </thead> <tbody> <tr ng-hide=\"!loading\"><td colspan=\"5\">Cargando...</td></tr> <tr ng-show=\"!loading && roles.length === 0\"><td colspan=\"5\">No hay registros</td></tr> <tr ng-class=\"{'danger': rol.estado_id === 2}\" ng-repeat=\"rol in roles\" row-id=\"{{ rol.id }}\"> <td>{{ rol.id }}</td> <td>{{ rol.descripcion }}</td> <td><button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"showRolesEdit(rol, $event)\"><span class=\"glyphicon glyphicon-pencil\"></span></button></td> </tr> </tbody> </table> </scrollable-table> </div> </div>"
  );


  $templateCache.put('views/slider.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Slider</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Slider</h2> <hr> <button class=\"btn btn-primary\" ng-click=\"saveOrden(slides)\"><span class=\"glyphicon glyphicon-ok\"></span> Guardar Orden</button> <br><br> <div class=\"row slider\"> <h3 ng-hide=\"!loading\">Cargando...</h3> <h3 ng-show=\"!loading && slides.length === 0\">No hay registros</h3> <div ui-sortable=\"sortableOptions\" ng-model=\"slides\"> <div class=\"col-sm-2\" ng-repeat=\"slide in slides\" ng-class=\"{'inactive-slide': slide.estado_id === 2}\" style=\"cursor: move\"> <div class=\"slide\"> <img class=\"img-responsive\" ng-src=\"{{ path_location}}/img/slides/{{ slide.url }}\"> <div class=\"edit animated fadeIn animation-slow\"> <button class=\"btn btn-warning btn-circle btn-lg\" ng-click=\"showSlidesEdit(slide)\"> <span class=\"glyphicon glyphicon-pencil\"></span> </button> </div> </div> </div> <div class=\"col-sm-2\"> <div class=\"slide cruz\" ng-click=\"showSlidesAdd()\"> <img class=\"img-responsive\" src=\"images/cruz-mas.svg\" alt=\"más\"> <div class=\"edit animated fadeIn animation-slow\"> </div> </div> </div> </div> </div>"
  );


  $templateCache.put('views/slides-add.html',
    "<form ng-submit=\"saveSlide(slide, 'btnSaveSlide', url_preview)\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Nuevo Slide</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"form-group\"> <label for=\"txtTitulo\">Título</label> <input id=\"txtTitulo\" class=\"form-control\" type=\"text\" ng-model=\"slide.titulo\"> <p class=\"help-block\">Dejar vacío si no se desea mostrar detalle del Slide.</p> </div> <div class=\"form-group\"> <label for=\"txtaContenido\">Contenido</label> <textarea id=\"txtaContenido\" class=\"form-control textarea-1x\" ng-model=\"slide.contenido\"></textarea> </div> <div class=\"form-group\" ng-hide=\"slide.titulo === undefined || slide.titulo === '' || slide.titulo === null\"> <div class=\"col-sm-6\"> <label for=\"clColor\">Color de Texto</label> <input id=\"clColor\" class=\"form-control\" type=\"color\" ng-model=\"slide.color\"> </div> <div class=\"col-sm-6\"> <label for=\"clColorFondo\">Color de Fondo</label> <input id=\"clColorFondo\" class=\"form-control\" type=\"color\" ng-model=\"slide.color_bg\"> </div> </div> <div class=\"form-group\"> <label for=\"flImagen\">Imagen</label> <input id=\"flImagen\" type=\"file\" class=\"form-control\" ngf-select=\"preview($file, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\" required> <img ng-hide=\"url_preview === undefined || url_preview === null\" class=\"img-responsive\" ng-src=\"{{tmp_path}}/{{url_preview}}\" alt=\"imagen previa\"> <span ng-show=\"loading\">Cargando...</span> <span ng-show=\"!loading && url_preview === null\">No fue posible cargar la imagen</span> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveSlide\" class=\"btn btn-success\" type=\"submit\">Guardar Slide</button> </div> </form>"
  );


  $templateCache.put('views/slides-edit.html',
    "<form ng-submit=\"saveSlide(slide, 'btnSaveSlide', url_preview)\"> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Editar Slide</h4> </div> <div class=\"modal-body modal-body-overflow\"> <div class=\"form-group\"> <label for=\"txtTitulo\">Título</label> <input id=\"txtTitulo\" class=\"form-control\" type=\"text\" ng-model=\"slide.titulo\"> <p class=\"help-block\">Dejar vacío si no se desea mostrar detalle del Slide.</p> </div> <div class=\"form-group\"> <label for=\"txtaContenido\">Contenido</label> <textarea id=\"txtaContenido\" class=\"form-control textarea-1x\" ng-model=\"slide.contenido\"></textarea> </div> <div class=\"form-group\" ng-hide=\"slide.titulo === undefined || slide.titulo === '' || slide.titulo === null\"> <div class=\"col-sm-6\"> <label for=\"clColor\">Color de Texto</label> <input id=\"clColor\" class=\"form-control\" type=\"color\" ng-model=\"slide.color\"> </div> <div class=\"col-sm-6\"> <label for=\"clColorFondo\">Color de Fondo</label> <input id=\"clColorFondo\" class=\"form-control\" type=\"color\" ng-model=\"slide.color_bg\"> </div> </div> <div class=\"form-group\"> <label for=\"flImagen\">Imagen</label> <input id=\"flImagen\" type=\"file\" class=\"form-control\" ngf-select=\"preview($file, $invalidFiles)\" accept=\"image/*\" ngf-max-height=\"5000\" ngf-max-size=\"10MB\"> <img ng-hide=\"url_preview === undefined || url_preview === null\" class=\"img-responsive\" ng-src=\"{{tmp_path}}/{{url_preview}}\" alt=\"imagen previa\"> <span ng-show=\"loading\">Cargando...</span> <span ng-show=\"!loading && url_preview === null\">No fue posible cargar la imagen</span> </div> <div class=\"form-group\"> <label>Estado</label> <div> <label><input type=\"radio\" ng-model=\"slide.estado_id\" ng-value=\"1\"> Activo</label> <label><input type=\"radio\" ng-model=\"slide.estado_id\" ng-value=\"2\"> Inactivo</label> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveSlide\" class=\"btn btn-success\" type=\"submit\">Guardar Slide</button> </div> </form>"
  );


  $templateCache.put('views/tipo_sugerencias-add.html',
    "<form novalidate angular-validator angular-validator-submit=\"saveTipoSugerencia(tipo_sugerencia, 'btnSaveTipoSugerencia')\" name=\"tipoSugerenciasAdd\" angular-validator-quiet> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Nuevo Tipo de Sugerencia</h4> </div> <div class=\"modal-body\"> <div class=\"form-group\"> <label for=\"txtDescripcion\">Descripción</label> <input id=\"txtDescripcion\" class=\"form-control\" type=\"text\" ng-model=\"tipo_sugerencia.descripcion\" name=\"infoDescripcion\" required required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> </div> <div class=\"form-group\"> <label for=\"txtEmailNuevo\">Email nuevo</label> <div class=\"input-group\"> <input id=\"txtEmailNuevo\" class=\"form-control\" type=\"text\" ng-model=\"email_nuevo\"> <span class=\"input-group-btn\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addEmail(email_nuevo)\"> <span class=\"glyphicon glyphicon-plus\"></span> </button> </span> </div> <div ui-sortable ng-model=\"tipo_sugerencia.detalle_sugerencias\"> <p class=\"input-group\" ng-repeat=\"detalle_sugerencia in tipo_sugerencia.detalle_sugerencias\" style=\"padding: 5px; cursor: move\"> <input type=\"text\" class=\"form-control\" ng-model=\"detalle_sugerencia.email\" name=\"detalleSugerenciaEmail{{ $index }}\" required required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> <span class=\"input-group-btn\"> <button type=\"button\" class=\"btn btn-warning\" ng-click=\"removeEmail(detalle_sugerencia)\">X</button> </span> </p> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveTipoSugerencia\" class=\"btn btn-success\" type=\"submit\">Guardar Tipo de Sugerencia</button> </div> </form>"
  );


  $templateCache.put('views/tipo_sugerencias-edit.html',
    "<form novalidate angular-validator angular-validator-submit=\"saveTipoSugerencia(tipo_sugerencia, 'btnSaveTipoSugerencia')\" name=\"tipoSugerenciasEdit\" angular-validator-quiet> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Modificar Tipo de Sugerencia</h4> </div> <div class=\"modal-body\"> <div class=\"form-group\"> <label for=\"txtDescripcion\">Descripción</label> <input id=\"txtDescripcion\" class=\"form-control\" type=\"text\" ng-model=\"tipo_sugerencia.descripcion\" name=\"infoDescripcion\" required required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> </div> <div class=\"form-group\"> <label for=\"txtEmailNuevo\">Email nuevo</label> <div class=\"input-group\"> <input id=\"txtEmailNuevo\" class=\"form-control\" type=\"text\" ng-model=\"email_nuevo\"> <span class=\"input-group-btn\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"addEmail(email_nuevo)\"> <span class=\"glyphicon glyphicon-plus\"></span> </button> </span> </div> <div ui-sortable ng-model=\"tipo_sugerencia.detalle_sugerencias\"> <p class=\"input-group\" ng-repeat=\"detalle_sugerencia in tipo_sugerencia.detalle_sugerencias\" style=\"padding: 5px; cursor: move\"> <input type=\"text\" class=\"form-control\" ng-model=\"detalle_sugerencia.email\" name=\"detalleSugerenciaEmail{{ $index }}\" required required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> <span class=\"input-group-btn\"> <button type=\"button\" class=\"btn btn-warning\" ng-click=\"removeEmail(detalle_sugerencia)\">X</button> </span> </p> </div> </div> <div class=\"form-group\"> <label>Estado</label> <div> <label><input type=\"radio\" ng-model=\"tipo_sugerencia.estado_id\" ng-value=\"1\"> Activo</label> <label><input type=\"radio\" ng-model=\"tipo_sugerencia.estado_id\" ng-value=\"2\"> Inactivo</label> </div> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveTipoSugerencia\" class=\"btn btn-success\" type=\"submit\">Guardar Tipo de Sugerencia</button> </div> </form>"
  );


  $templateCache.put('views/tipo_sugerencias.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Tipos de Sugerencias</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Tipos de Sugerencias</h2> <hr> <div class=\"row\"> <div class=\"col-sm-10 col-sm-offset-1\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"showTipoSugerenciasAdd($event)\"><span class=\"glyphicon glyphicon-plus\"></span> Nuevo Tipo de Sugerencia</button> <scrollable-table watch=\"tipo_sugerencias\" class=\"table-responsive\"> <table class=\"table table-striped\"> <thead> <tr> <th sortable-header col=\"id\">Código</th> <th sortable-header col=\"descripcion\">Descripción</th> <th>Acciones</th> </tr> </thead> <tbody> <tr ng-hide=\"!loading\"><td colspan=\"5\">Cargando...</td></tr> <tr ng-show=\"!loading && tipo_sugerencias.length === 0\"><td colspan=\"5\">No hay registros</td></tr> <tr ng-class=\"{'danger': tipo_sugerencia.estado_id === 2}\" ng-repeat=\"tipo_sugerencia in tipo_sugerencias\" row-id=\"{{ tipo_sugerencia.id }}\"> <td>{{ tipo_sugerencia.id }}</td> <td>{{ tipo_sugerencia.descripcion }}</td> <td><button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"showTipoSugerenciasEdit(tipo_sugerencia, $event)\"><span class=\"glyphicon glyphicon-pencil\"></span></button></td> </tr> </tbody> </table> </scrollable-table> </div> </div>"
  );


  $templateCache.put('views/users-add.html',
    "<form novalidate angular-validator angular-validator-submit=\"saveUser(user, 'btnSaveUser')\" name=\"usersAdd\" angular-validator-quiet> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Nuevo Usuario</h4> </div> <div class=\"modal-body\"> <div class=\"form-group\"> <label for=\"txtUsername\">Nombre de Usuario</label> <input id=\"txtUsername\" class=\"form-control\" type=\"text\" ng-model=\"user.username\" required name=\"userUsername\" required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> </div> <div class=\"form-group\"> <label for=\"txtPassword\">Password</label> <input id=\"txtPassword\" class=\"form-control\" type=\"password\" ng-model=\"user.password\" required name=\"userPassword\" required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> </div> <div class=\"form-group\"> <label for=\"txtEmail\">Email</label> <input id=\"txtEmail\" class=\"form-control\" type=\"email\" ng-model=\"user.email\" required name=\"userEmail\" required-message=\"'Este campo es requerido'\" invalid-message=\"'Debe ingresar un correo electrónico'\" validate-on=\"blur\"> </div> <div class=\"form-group\"> <label for=\"sltRol\">Rol</label> <select id=\"sltRol\" class=\"form-control\" ng-options=\"rol.id as rol.descripcion for rol in roles\" ng-model=\"user.rol_id\" name=\"rol\" required required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> <option value=\"\">Selecciona un Rol</option> </select> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveUser\" class=\"btn btn-success\" type=\"submit\">Guardar Usuario</button> </div> </form>"
  );


  $templateCache.put('views/users-edit.html',
    "<form novalidate angular-validator angular-validator-submit=\"saveUser(user, 'btnSaveUser')\" name=\"usersAdd\" angular-validator-quiet> <div class=\"modal-header\"> <button type=\"button\" class=\"close\" ng-click=\"cancel()\" data-dismiss=\"modal\" aria-hidden=\"true\"><span aria-hidden=\"true\">&times;</span></button> <h4 class=\"modal-title\">Modificar Usuario</h4> </div> <div class=\"modal-body\"> <div class=\"form-group\"> <label for=\"txtUsername\">Nombre de Usuario</label> <input id=\"txtUsername\" class=\"form-control\" type=\"text\" ng-model=\"user.username\" required name=\"userUsername\" required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> </div> <div class=\"form-group\"> <label for=\"txtPassword\">Password</label> <input id=\"txtPassword\" class=\"form-control\" type=\"password\" ng-model=\"user.password\" required name=\"userPassword\" required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> </div> <div class=\"form-group\"> <label for=\"txtEmail\">Email</label> <input id=\"txtEmail\" class=\"form-control\" type=\"email\" ng-model=\"user.email\" required name=\"userEmail\" required-message=\"'Este campo es requerido'\" invalid-message=\"'Debe ingresar un correo electrónico'\" validate-on=\"blur\"> </div> <div class=\"form-group\"> <label for=\"sltRol\">Rol</label> <select id=\"sltRol\" class=\"form-control\" ng-options=\"rol.id as rol.descripcion for rol in roles\" ng-model=\"user.rol_id\" name=\"rol\" required required-message=\"'Este campo es requerido'\" validate-on=\"blur\"> <option value=\"\">Selecciona un Rol</option> </select> </div> </div> <div class=\"modal-footer\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cerrar</button> <button id=\"btnSaveUser\" class=\"btn btn-success\" type=\"submit\">Guardar Usuario</button> </div> </form>"
  );


  $templateCache.put('views/users-login.html',
    "<div class=\"col-sm-4 col-sm-offset-4 dv-login\"> <img class=\"img-responsive\" src=\"images/logo.png\" alt=\"Logo Tuplast\"> <form novalidate angular-validator angular-validator-submit=\"loginUser(user, 'btnLoginUser')\" name=\"usersLogin\" angular-validator-quiet> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h2>Login</h2> </div> <div class=\"panel-body\"> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <div class=\"form-group\"> <label for=\"txtUsername\">Nombre de Usuario</label> <div class=\"input-group\"> <div class=\"input-group-addon\"><span class=\"glyphicon glyphicon-user\"></span></div> <input id=\"txtUsername\" class=\"form-control\" type=\"text\" ng-model=\"user.username\"> </div> </div> <div class=\"form-group\"> <label for=\"txtPassword\">Password</label> <div class=\"input-group\"> <div class=\"input-group-addon\"><span class=\"glyphicon glyphicon-flash\"></span></div> <input id=\"txtPassword\" class=\"form-control\" type=\"password\" ng-model=\"user.password\"> </div> </div> </div> <div class=\"panel-footer\"> <button id=\"btnLoginUser\" type=\"submit\" class=\"btn btn-primary\">Login</button> </div> </div> </form> </div>"
  );


  $templateCache.put('views/users.html',
    "<ol class=\"breadcrumb\"> <li><a href=\"#\">Inicio</a></li> <li>Usuarios</li> </ol> <div class=\"alert alert-dismissible\" ng-class=\"{'alert-success': message.type === 'success', 'alert-danger': message.type === 'error'}\" role=\"alert\" ng-show=\"message.type !== undefined\"> <button type=\"button\" class=\"close\" ng-click=\"message.type = undefined\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> {{ message.text }} </div> <h2>Usuarios</h2> <hr> <div class=\"row\"> <div class=\"col-sm-10 col-sm-offset-1\"> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"showUsersAdd($event)\"><span class=\"glyphicon glyphicon-plus\"></span> Nuevo Usuario</button> <scrollable-table watch=\"users\" class=\"table-responsive\"> <table class=\"table table-striped\"> <thead> <tr> <th sortable-header col=\"id\">Código</th> <th style=\"width: 20%\" sortable-header col=\"username\">Nombre de Usuario</th> <th sortable-header col=\"email\">Email</th> <th sortable-header col=\"rol.descripcion\">Rol</th> <th>Acciones</th> </tr> </thead> <tbody> <tr ng-hide=\"!loading\"><td colspan=\"5\">Cargando...</td></tr> <tr ng-show=\"!loading && users.length === 0\"><td colspan=\"5\">No hay registros</td></tr> <tr ng-class=\"{'danger': user.estado_id === 2}\" ng-repeat=\"user in users\" row-id=\"{{ user.id }}\"> <td>{{ user.id }}</td> <td style=\"width: 20%\">{{ user.username }}</td> <td>{{ user.email }}</td> <td>{{ user.rol.descripcion }}</td> <td><button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"showUsersEdit(user, $event)\"><span class=\"glyphicon glyphicon-pencil\"></span></button></td> </tr> </tbody> </table> </scrollable-table> </div> </div>"
  );

}]);
