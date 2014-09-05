'use strict';

//Clients service used for clients REST endpoint
angular.module('mean')
.factory('Clients', ['$resource',
    function($resource) {
        return $resource('clients/:clientId/:projects:concepts', {
            clientId: '@_id',
            concepts: '@concepts',
            projects: '@projects'
        }, {
            update: {
                method: 'PUT'
            },
            projects: {
                method: 'GET',
                params: {
                    projects: 'projects'
                },
                isArray: true
            },
            concepts: {
                method: 'GET',
                params: {
                    concepts: 'concepts'
                },
                isArray: true
            }
        });
    }
]);
