'use strict';

//Slideshows service used for slideshows REST endpoint
angular.module('mean')
.factory('Shorturls', [
    '$resource',
    function ($resource) {
        return $resource('bitly/:slideshowId', { slideshowId: '@_id' });
    }
]);
