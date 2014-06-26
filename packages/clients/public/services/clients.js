'use strict';

//Clients service used for clients REST endpoint
angular.module('mean')
.factory('Clients', ['$resource',
    function($resource) {
        return $resource('clients/:clientId', {
            clientId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
