'use strict';
/* Directives */
angular.module('mean')
.directive('tgInitiateImpress', [
    '$timeout',
    '$rootScope',
    function($timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }
]);