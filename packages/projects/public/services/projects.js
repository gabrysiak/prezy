'use strict';

//Projects service used for projects REST endpoint
angular.module('mean')
.factory('Projects', ['$resource',
    function($resource) {
        return $resource('projects/:projectId/:slideshows', {
            projectId: '@_id',
            slideshows: '@slideshows'
        }, {
            update: {
                method: 'PUT'
            },
            slideshows: {
                method: 'GET',
                params: {
                    slideshows: 'slideshows'
                },
                isArray: true
            }
        });
    }
]);
