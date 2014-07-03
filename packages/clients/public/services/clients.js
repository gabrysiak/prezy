'use strict';

//Clients service used for clients REST endpoint
angular.module('mean')
.factory('Clients', ['$resource',
    function($resource) {
        return $resource('clients/:clientId/:slideshows', {
            clientId: '@_id',
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
