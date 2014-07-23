'use strict';

//Rounds service used for slideshow slides
angular.module('mean')
.factory('Rounds', function () {
    return {
        all: function () {
            return [
                {
                    value: 'first',
                    text: 'First'
                },
                {
                    value: 'second',
                    text: 'Second'
                }
            ];
        }
    };
});