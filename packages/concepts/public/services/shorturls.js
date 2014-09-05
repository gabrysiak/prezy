'use strict';

//Concepts service used for concepts REST endpoint
angular.module('mean')
.factory('Shorturls', ['$resource',
    function ($resource) {
        return $resource('bitly/:conceptId', { conceptId: '@_id' });
    }
]);
