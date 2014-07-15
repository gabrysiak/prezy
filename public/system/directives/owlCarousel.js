'use strict';
/* Directives */
angular.module('mean')
.directive('tgOwlCarousel', [
    function () {  
        return {  
            restrict: 'E',  
            link: function (scope, element, attrs) {  
                var options = scope.$eval($(element).attr('data-options'));  
                $(element).owlCarousel(options);  
            }  
        };  
    }
]);