'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', '$sce', function ($scope, Global, $sce) {
    $scope.global = Global;
}]);