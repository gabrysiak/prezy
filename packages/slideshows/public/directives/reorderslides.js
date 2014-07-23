'use strict';
/* Directives */
angular.module('mean')
.directive('tgReorderSlides', ['$timeout',
    function ($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                // watch only the first slide for changes in values.
                scope.$watch('slides[0]', function(){
                    scope.reorderSlides(scope.slides);
                });
            }
        };
    }
]);