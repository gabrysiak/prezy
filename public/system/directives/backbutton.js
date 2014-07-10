'use strict';
/* Directives */
angular.module('mean')
.directive('tgBack', [
    function () {
        return {
            restrict: 'A',

            link: function(scope, element, attrs) {
                element.bind('click', function () {
                    history.back();
                    scope.$apply();
                });
            }
        };
    }
]);