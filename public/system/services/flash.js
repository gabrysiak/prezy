'use strict';

//Global service for global variables
angular.module('mean.system').factory('FlashService', [
  '$rootScope',
  function ($rootScope) {
    return {
      show: function (response) {
        $rootScope.flash = response.flash;
        $rootScope.flashType = response.status;
      },
      clear: function () {
        $rootScope.flash = '';
        $rootScope.flashType = '';
      }
    };
  }
]);
