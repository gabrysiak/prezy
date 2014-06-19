'use strict';

//Slideshows service used for slideshows REST endpoint
angular.module('mean')
.factory('Slideshows', ['$resource',
    function($resource) {
        return $resource('slideshows/:slideshowId', {
            slideshowId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
