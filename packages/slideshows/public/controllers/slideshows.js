'use strict';

angular.module('mean.slideshows').controller('SlideshowsController', ['$scope', 'Global', 'Slideshows',
    function($scope, Global, Slideshows) {
        $scope.global = Global;
        $scope.package = {
            name: 'slideshows'
        };
    }
]);
