'use strict';

//Concepts service used for concepts REST endpoint
angular.module('mean')
.factory('Concepts', ['$resource',
    function($resource) {
        return $resource('concepts/:conceptId', {
            conceptId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
