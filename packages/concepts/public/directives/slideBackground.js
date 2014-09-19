'use strict';
/* Directives */
angular.module('mean')
.directive('tgSlideBackground', [
    '$timeout',
    '$rootScope',
    '$document',
    function($timeout, $rootScope,  $document) {
        return {
            restrict: 'A',
            scope: {
                slide: '=tgSlideBackground' 
            },
            link: function (scope, element, attr) {
                var index = scope.slide.index,
                    concepts = scope.slide.concepts;

                $document.on('impress:stepenter', function(e) {
                    e.preventDefault();
                    
                    var slideClasses = $(e.target).attr('class').split(/\s+/),
                        slideNumber = parseInt(slideClasses[0].replace(/^\D+/g, ''));

                    if (slideNumber === index) {
                        var bkgImage = concepts[index].bkgImage,
                            bkgColor = concepts[index].bkgColor;

                        // refresh scope
                        scope.$watch('concepts', function() {
                            if (bkgImage) {
                                $document.find('body').css('background-image', 'url(' + bkgImage + ')').css('-webkit-transition', 'background-image 2 ease-in-out').css('-moz-transition', 'background-image 2 ease-in-out').css('-o-transition', 'background-image 2 ease-in-out').css('-ms-transition', 'background-image 2 ease-in-out').css('transition', 'background-image 2 ease-in-out');
                            } else {
                                $document.find('body').css('background', bkgColor).css('-webkit-transition', 'background-color 1000ms linear').css('-moz-transition', 'background-color 1000ms linear').css('-o-transition', 'background-color 1000ms linear').css('-ms-transition', 'background-color 1000ms linear').css('transition', 'background-color 1000ms linear');
                            }
                        });
                    } else {
                        // clear out background image if has one
                        $document.find('body').css('background-image', '');
                    }
                });
            }
        };
    }
]);