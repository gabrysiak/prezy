'use strict';

//Templates service used to get updated projects for client
angular.module('mean')
.factory('ClientProjects', ['Clients', '$q',
    function (Clients, $q) {
    
        var clientProjects = function(clientId) {
            var deferred = $q.defer();

            if (typeof clientId === 'undefined') return;

            Clients.projects({
                clientId: clientId
            }, function(projects) {
                if (!projects && !projects.length) return;

                deferred.resolve(projects);
            }); 
            return deferred.promise;
        };

        var _createDropdown = function(clientId) {
            if (!clientId) return;
            var deferred = $q.defer(),
                dropdown = [];
            
            clientProjects(clientId)
                .then(function(projs) {
                    angular.forEach(projs, function(proj) {
                        dropdown.push({
                            value: proj._id,
                            text: proj.title
                        });
                    });

                    deferred.resolve(dropdown);
                }, function(err) {
                    return err;
                });

            return deferred.promise;
        };

        return {
            getProjects: function(clientId) {
                return clientProjects(clientId);
            },
            populateDropdown: function(clientId) {
                return _createDropdown(clientId);
            }
        };
    }
]);