'use strict';

//Templates service used for default rounds
angular.module('mean')
.factory('DefaultRounds', function () {
    return {
        all: function () {
            return [
                {
                    value: 1,
                    text: 'Round 1'
                },
                {
                    value: 2,
                    text: 'Round 2'
                }
            ];
        }
    };
});