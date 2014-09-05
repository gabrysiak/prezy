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
var modules = ['ngSanitize', 'ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.auth', 'checklist-model', 'angularFileUpload', 'hmTouchEvents', 'ngRepeatReorder'];
modules = modules.concat(packageModules);

// Combined modules
angular.module('mean', modules).run(['$rootScope','$location', 
    function ($rootScope,$location) {

        // check current url
        $rootScope.currentLocation = function (url) {
            var re = new RegExp('^.*'+url+'.*','gi'); 
            return re.test(location.hash);
        };
    }
]);
