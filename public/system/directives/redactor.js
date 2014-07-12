'use strict';
/* Directives */
angular.module('mean')
.directive('redactor', [
    function () {
        return {
            require: '?ngModel',
            restrict: 'E',
            link: function (scope, el, attrs, ngModel) {

                // Function to update model
                var updateModel = function() {
                    if(!scope.$$phase) {
                        scope.$apply(ngModel.$setViewValue(el.redactor('get')));
                    }
                };

                var uploadErrorHandling = function(response)
                {
                    console.log(response.error);
                }; 

                var uploadCallback = function(image, response) {
                    console.log(image,response);
                };
                // Get the redactor element and call update model
                el.redactor({
                    minHeight: 100,
                    buttons: ['formatting', '|', 'bold', 'italic', 'deleted', '|',
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