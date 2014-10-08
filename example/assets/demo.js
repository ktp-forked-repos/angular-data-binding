angular.module('gjs', [
        'ngRoute'
    ])
    /**
     * Directive
     */
    .directive('bindNow', function () {
        return {
            scope: false,
            link: function (scope, element, attrs) {
                element.text(scope.$eval(attrs.bindNow));
            }

        }
    })
    .directive('bindLater', function () {
        return {
            scope: false,
            link: function (scope, element, attrs) {
                var deRegister = scope.$watch(attrs.bindLater, function (val) {
                    if (val !== undefined) {
                        element.text(attrs.bindExpr !== undefined ? scope.$eval(attrs.bindExpr) : val);
                        deRegister();
                    }
                });
            }
        }
    })
    .directive('showWhen', function () {
        return {
            scope: false,
            link: function (scope, element, attrs) {
                element.addClass('ng-hide');

                var deRegister = scope.$watch(attrs.showWhen, function (val) {
                    if (val !== undefined) {
                        element.removeClass('ng-hide');
                        deRegister();
                    }
                });
            }
        }
    })
    /**
     * Run
     */
    .run(function ($rootScope, $location) {
        $rootScope.$location = $location;
    })
    /**
     * Config router
     */
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/pizza/sync/:id', {
                // templateUrl: 'views/pizza-sync.html',
                templateUrl: 'views/pizza-sync.html',
                controller: 'PizzaSyncController',
                resolve: {
                    // I will cause a 1 second delay
                    pizza: function($http, $route) {
                        return $http.get('data/pizza-' + $route.current.params.id + '.json');
                    }
                }
            })
            .when('/pizza/async/:id', {
                // templateUrl: 'views/pizza-async.html',
                templateUrl: 'views/pizza-async.html',
                controller: 'PizzaAsyncController'
            });
    })
    /**
     * Pizza sync controller
     */
    .controller('PizzaSyncController', function ($scope, pizza) {
        $scope.pizza = pizza.data;
    })
    /**
     * Pizza async controller
     */
    .controller('PizzaAsyncController', function ($http, $timeout, $route, $scope) {
        $http.get('data/pizza-' + $route.current.params.id + '.json').then(function (pizza) {
            $timeout(function () {
                $scope.pizza = pizza.data;
            }, 1000);
        });
    });
