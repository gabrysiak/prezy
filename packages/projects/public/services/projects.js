'use strict';

//Projects service used for projects REST endpoint
angular.module('mean')
.factory('Projects', ['$resource',
    function($resource) {
        return $resource('projects/:projectId/:concepts:rounds', {
            projectId: '@_id',
            concepts: '@concepts',
            rounds: '@rounds'
        }, {
            update: {
                method: 'PUT'
            },
            concepts: {
                method: 'GET',
                params: {
                    concepts: 'concepts'
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
