'use strict';

//Projects service used for projects REST endpoint
angular.module('mean')
.factory('Projects', ['$resource',
    function($resource) {
        return $resource('projects/:projectId/:slideshows:rounds', {
            projectId: '@_id',
            slideshows: '@slideshows',
            rounds: '@rounds'
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
            },
            rounds: {
                method: 'GET',
                params: {
                    rounds: 'rounds'
                },
                isArray: true
            }
        });
    }
]);
