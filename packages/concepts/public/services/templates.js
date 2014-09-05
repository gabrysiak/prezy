'use strict';

//Templates service used for concept slides
angular.module('mean')
.factory('Templates', function () {
    return {
        all: function () {
            return [
                {
                    value: 'title',
                    text: 'Title'
                },
                {
                    value: '2-col',
                    text: '2 Column'
                }
            ];
        }
    };
});