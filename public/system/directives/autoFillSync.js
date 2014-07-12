'use strict';
/* Directives */
angular.module('mean')
.directive('tgAutoFillSync', [
    '$timeout',
    '$interval',
    function($timeout, $interval) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var fixSummernote = $interval(function(){
                    $timeout(function(){
                        $('.note-toolbar').trigger('click');
                    });
                },3000);
                scope.$on('$destroy', function (event) {
                  $interval.cancel(fixSummernote);
                });
            }
        };
    }
]);