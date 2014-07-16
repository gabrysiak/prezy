'use strict';
/* Directives */
angular.module('mean')
.directive('tgOwlCarousel', [
    function () {  
        return {  
            restrict: 'E',  
            link: function (scope, element, attrs) {
     
                scope.$watch(attrs.watch, function(newVal, oldVal) {
                    var options = scope.$eval($(element).attr('data-options')); 

                    if( newVal && newVal.length > 0 ){
                        $(element).owlCarousel(options);
                    }
                });
                 
                 
            }  
        };  
    }
]);