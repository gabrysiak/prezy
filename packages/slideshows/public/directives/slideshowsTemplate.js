'use strict';
/* Directives */
angular.module('mean')
.directive('tgSlideshowsTemplate', [
    '$compile', '$http', '$templateCache',
    function ($compile, $http, $templateCache) {
        
        var getTemplate = function(template) {
            var templateLoader,
                templateMap,
                baseUrl = '/public/templates/slideshows/';

            switch (template) {
                case 'title': 
                    templateMap = 'title.html';
                    break;
                case '2-col': 
                    templateMap = '2-col.html';
                    break;
                default:  
                    templateMap =  'default.html';
            }

            var templateUrl = baseUrl + templateMap;
            templateLoader = $http.get(templateUrl, {cache: $templateCache});

            return templateLoader;

        };

        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                var loader = getTemplate(scope.slide.template),
                    promise;
                    

                promise = loader.success(function(html) {
                    element.html(html);
                }).then(function (response) {
                    element.replaceWith($compile(element.html())(scope));
                });
            }
        };
    }
]);