'use strict';
/* Directives */
angular.module('mean')
.directive('ngBack', [
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