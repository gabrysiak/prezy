'use strict';

angular.module('mean').controller('ClientsController', ['$scope', '$stateParams', '$location', '$http', '$log', 'Global', 'Clients',
    function($scope, $stateParams, $location, $http, $log, Global, Clients) {
        $scope.global = Global;

        $scope.hasAuthorization = function(client) {
            if (!client || !client.user) return false;
            return $scope.global.isAdmin || client.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {

            if (isValid) {
                var client = new Clients({
                    title: this.title,
                    content: this.content
                });
                client.$save(function(response) {
                    $location.path('clients/' + response._id);
                });

            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(client) {
            if (client) {
                client.$remove();

                for (var i in $scope.clients) {
                    if ($scope.clients[i] === client) {
                        $scope.clients.splice(i, 1);
                    }
                }
            } else {
                $scope.client.$remove(function(response) {
                    $location.path('clients');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var client = $scope.client;
                
                if (!client.updated) {
                    client.updated = [];
                }
                client.updated.push(new Date().getTime());

                client.$update(function() {
                    $location.path('clients/' + client._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Clients.query(function(clients) {
                $scope.clients = clients;
            });
        };

        $scope.findOne = function() {
            Clients.get({
                clientId: $stateParams.clientId
            }, function(client) {
                $scope.client = client;
            });
        };
    }
]);