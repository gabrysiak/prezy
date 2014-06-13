'use strict';

angular.module('mean.slideshows').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('slideshows example page', {
            url: '/slideshows/example',
            templateUrl: 'slideshows/views/index.html'
        });
    }
]);
