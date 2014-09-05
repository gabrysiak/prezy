'use strict';

//Rounds service used for rounds REST endpoint
angular.module('mean')
.factory('Rounds', ['$resource',
    function($resource) {
        return $resource('rounds/:roundId/:concepts', {
            roundId: '@_id',
            concepts: '@concepts'
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
            }
        });
    }
]);
