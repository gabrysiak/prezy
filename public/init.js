'use strict';

angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, ['mean']);

});

// Dynamically add angular modules declared by packages
var packageModules = [];
for (var index in window.modules) {
    angular.module(window.modules[index].module, window.modules[index].angularDependencies || []);
    packageModules.push(window.modules[index].module);
}

// Default modules
var modules = ['ngAnimate', 'ngSanitize', 'ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.auth', 'checklist-model', 'angularFileUpload', 'hmTouchEvents', 'ngRepeatReorder', 'mgcrea.ngStrap.tooltip', 'colorpicker.module', 'flow'];
modules = modules.concat(packageModules);

// Combined modules
angular.module('mean', modules).run(['$rootScope','$location', 
    function ($rootScope,$location) {

        $rootScope.$on('$locationChangeStart', function ( ev, newPath, oldPath ) {
            // The down side of this method is that we get the whole url, but we are only interested in the
            // path part. So we have to parse it.
            var path = /^([^\?#]*)?(\?([^#]*))?(#(.*))?$/.exec(oldPath);
            if( path[5] ) {
                path = path[5].substr(path[5].indexOf('\/'));
            } else {
                path = '/';
            }

            $rootScope.referrerUrl = '#!' + path;
        });

        // check current url
        $rootScope.currentLocation = function (url) {
            var re = new RegExp('^.*'+url+'.*','gi'); 
            return re.test(location.hash);
        };
    }
])
// This is required for AngularStrap Tooltips
.config(function($tooltipProvider) {
    angular.extend($tooltipProvider.defaults, {
        html: true
    });
})

.config(['flowFactoryProvider', function (flowFactoryProvider) {
    flowFactoryProvider.defaults = {
        target: '/uploads/concepts/backgrounds',
        permanentErrors: [404, 500, 501],
        maxChunkRetries: 1,
        chunkRetryInterval: 5000,
        simultaneousUploads: 4
    };
    flowFactoryProvider.on('catchAll', function (event) {
        console.log('catchAll', arguments);
    });
    // Can be used with different implementations of Flow.js
  // flowFactoryProvider.factory = fustyFlowFactory;
}]);
