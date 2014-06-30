'use strict';

angular.module('mean').controller('ClientsController', ['$scope', '$stateParams', '$location', '$http', '$log', 'Global', 'Clients', 'Slideshows', 'FlashService', '$timeout', '$upload',
    function($scope, $stateParams, $location, $http, $log, Global, Clients, Slideshows, FlashService, $timeout, $upload) {
        $scope.global = Global;

        $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: '/uploads/logos', //upload.php script, node.js route, or servlet url
                // method: 'POST' or 'PUT',
                // headers: {'header-key': 'header-value'},
                // withCredentials: true,
                // data: {client: this},
                file: file, // or list of files: $files for html5 only
                /* set the file formData name ('Content-Desposition'). Default is 'file' */
                //fileFormDataName: myFile, //or a list of names for multiple files (html5).
                /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
                //formDataAppender: function(formData, key, val){}
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                if (!$scope.client) {
                    $scope.client = {};
                }
                $scope.client.logo = JSON.parse(data);
            });
            //.error(...)
            //.then(success, error, progress); 
            //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
            }
            /* alternative way of uploading, send the file binary with the file's content-type.
           Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
           It could also be used to monitor the progress of a normal http post/put request with large data*/
            // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        };

        $scope.removeLogo = function(client) {
            if (client) {
                // delete request to api
                $http.delete('/uploads/logos/' + client._id)
                    .success(function (data, status, headers, config) {
                        if (status !== 200) return;
                        //update the model
                        $scope.client.logo = null;

                        client.$update();
                    }).error(function (data, status, headers, config) {
                        console.log(data);
                        return data;
                });
            } else {
                $location.path('clients');
            }
        };

        $scope.hasAuthorization = function(client) {
            if (!client || !client.user) return false;
            return $scope.global.isAdmin || client.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                var client = new Clients({
                    title: this.title,
                    content: this.content,
                    contactName: this.contactName,
                    contactEmail: this.contactEmail,
                    logo: $scope.client.logo
                });
                client.$save(function(response) {
                    $location.path('clients/' + response._id);
                });

            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(client) {
            if (client) {
                client.$remove();

                for (var i in $scope.clients) {
                    if ($scope.clients[i] === client) {
                        $scope.clients.splice(i, 1);
                    }
                }
            } else {
                $scope.client.$remove(function(response) {
                    $location.path('clients');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var client = $scope.client;
                // check if logo was uploaded
                if ($scope.client.logo) {
                    client.logo = $scope.client.logo;
                }
                if (!client.updated) {
                    client.updated = [];
                }
                client.updated.push(new Date().getTime());

                client.$update(function() {
                    $location.path('clients/' + client._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Clients.query(function(clients) {         
                angular.forEach(clients, function(client){
                    $http.get('/clients/' + client._id + '/slideshows')
                        .success(function (data, status, headers, config) {
                        if (status !== 200) return;
                        client.slideshows = data;                          
                    }).error(function (data, status, headers, config) {
                        console.log(data);
                    });
                });
                $scope.clients = clients;
            });
        };

        $scope.findOne = function() {
            Clients.get({
                clientId: $stateParams.clientId
            }, function(client) {
                $scope.client = client;
            });
        };
    }
]);