'use strict';
/* Directives */
angular.module('mean')
.directive('tgNotification', [
  '$timeout',
  '$rootScope',
  function ($timeout, $rootScope) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var timer = $timeout(function () {

            angular.element(elem).hide();
            $rootScope.flash = null;
            $rootScope.flashType = null;
          }, 6000);
        scope.$on('$destroy', function (event) {
          $timeout.cancel(timer);
        });
      }
    };
  }
]);