'use strict';

//Clients service used for clients REST endpoint
angular.module('mean')
.factory('Clients', ['$resource',
    function($resource) {
        return $resource('clients/:clientId/:projects/:slideshows', {
            clientId: '@_id',
            slideshows: '@slideshows',
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
