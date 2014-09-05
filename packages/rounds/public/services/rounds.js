'use strict';

//Rounds service used for rounds REST endpoint
angular.module('mean')
.factory('Rounds', ['$resource',
    function($resource) {
        return $resource('rounds/:roundId', {
            roundId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
