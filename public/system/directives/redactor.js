'use strict';
/* Directives */
angular.module('mean')
.directive('redactor', [
    '$timeout',
    function ($timeout) {
        return {
            require: '?ngModel',
            restrict: 'E',
            link: function (scope, el, attrs, ngModel) {

                // Function to update model
                var updateModel = function() {
                    $timeout(function () {
                        if(!scope.$$phase) {
                            scope.$apply(ngModel.$setViewValue(el.redactor('get')));
                        }
                    });
                };

                var uploadErrorHandling = function(response)
                {
                    // error handling here
                    console.log(response.error);
                }; 

                var uploadCallback = function(image, response) {
                    // do this after uploaded image
                    console.log(image,response);
                };
                // Get the redactor element and call update model
                el.redactor({
                    minHeight: 100,
                    buttons: ['html', 'formatting', '|', 'bold', 'italic', 'underline', 'deleted', '|',
                    'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
                    'image', 'video', 'file', 'table', 'link', '|', 'alignment', '|', 'horizontalrule'],
                    keyupCallback: updateModel,
                    keydownCallback: updateModel,
                    changeCallback: updateModel,
                    execCommandCallback: updateModel,
                    autosaveCallback: updateModel,
                    imageUpload: '/uploads/slideshows',
                    imageUploadErrorCallback: uploadErrorHandling,
                    imageUploadCallback: uploadCallback,
                    fileUpload: '/uploads/slideshows',
                    fileUploadCallback: uploadCallback,
                    fileUploadErrorCallback: uploadErrorHandling,
                    imageGetJson: '/uploads/slideshows'
                });

                // Call to sync the redactor content
                ngModel.$render = function(value) {
                    el.redactor('set', ngModel.$viewValue);
                };
            }
        };
    }
]);