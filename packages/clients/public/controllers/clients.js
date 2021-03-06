'use strict';

angular.module('mean').controller('ClientsController', ['$scope', '$stateParams', '$location', '$http', '$log', '$modal', 'Global', 'Clients', 'Concepts', 'Projects', 'FlashService', 'Tooltips', '$timeout', '$upload',
    function($scope, $stateParams, $location, $http, $log, $modal, Global, Clients, Concepts, Projects, FlashService, Tooltips, $timeout, $upload) {
        $scope.global = Global;

        // get all background images
        $http.get('/uploads/logos')
            .success(function (data, status, headers, config) {
                if (status !== 200) return;
                //update the model
                $scope.logos = data;

            }).error(function (data, status, headers, config) {
                console.log(data);
        });

        // get tooltips
        Tooltips.getTooltips('Clients').then(function(tooltips) {
            $scope.tooltips = tooltips;
        }, function(err) {
            console.log(err);
        });

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

        /**
         * CURRENTLY UNUSED
         * Delete a logo Perm from server
         * @param  {object} client Client object
         * @return {void}
         */
        $scope.deleteLogo = function(client) {
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
                    abbr: this.abbr,
                    content: this.content,
                    contactName: this.contactName,
                    contactEmail: this.contactEmail,
                    logo: $scope.client.logo
                });
                client.$save(function(response) {
                    $location.path('clients');
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
                    // $location.path('clients/' + client._id);
                    $location.path('clients');
                }, function(err) {
                    // error
                    var error = {
                        flash: err.data.error,
                        status: err.data.status
                      };
                    FlashService.show(error);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Clients.query(function(clients) {         
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

        $scope.findConcepts = function() {
            Clients.concepts({
                clientId: $stateParams.clientId
            }, function(concepts) {
                $scope.concepts = concepts;
                $scope.findOne();
            });
        };

        $scope.removeConcept = function(concept) {
            Concepts.delete({
                conceptId: concept._id
            }, function(concept){
                // remove concept from scope
                $scope.concepts = _.without($scope.concepts, _.findWhere($scope.concepts, {_id: concept._id}));
            });
        };

        $scope.findProjects= function() {
            Clients.projects({
                clientId: $stateParams.clientId
            }, function(projects) {
                $scope.projects = projects;
                $scope.findOne();
            });
        };

        $scope.removeProject = function(project) {
            Projects.delete({
                projectId: project._id
            }, function(project){
                // remove project from scope
                $scope.projects = _.without($scope.projects, _.findWhere($scope.projects, {_id: project._id}));
            });
        };

        $scope.email = function () {
            Clients.concepts({
                clientId: $stateParams.clientId
            }, function(concepts) {
                $scope.concepts = concepts;
            });

            var modalInstance = $modal.open({
                templateUrl: 'clients/views/partials/modal-email.html',
                controller: ModalInstanceController,
                resolve: {
                    concepts: function () {
                        return $scope.concepts;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        var ModalInstanceController = function ($scope, $modalInstance, concepts) {
            $scope.send = {
                links: []
            };

            $scope.concepts = concepts;

            $scope.ok = function (isValid) {
                if (isValid) {
                    // post request to email api
                    $http.post('/email/concepts', $scope.send)
                        .success(function (data, status, headers, config) {
                            if (status === 200) {
                                //update the model
                                var success = {
                                    flash: 'Email has been sent',
                                    status: 'success'
                                };

                                return $modalInstance.close(FlashService.show(success));
                            }
                            //update the model
                            var error = {
                                flash: 'Email not sent',
                                status: 'danger'
                            };

                            $modalInstance.close(FlashService.show(error));
                        }).error(function (data, status, headers, config) {
                            console.log(data);
                            return data;
                    });

                    
                } else {
                    $scope.submitted = true;
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        // Modal to view previously uploaded logo images
        $scope.viewLogos = function(logos) {
            var modalInstance = $modal.open({
                templateUrl: 'clients/views/partials/modal-logos.html',
                controller: LogoModalInstanceController,
                resolve: {
                    logos: function () {
                        return logos;
                    },
                    client: function () {
                        return $scope.client;
                    }
                }
            });

            modalInstance.result.then(function (logo) {
                if ($scope.client && $scope.client.logo) {
                    $scope.client.logo = logo;
                } else {
                    $scope.logo = logo;
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        var LogoModalInstanceController = function ($scope, $modalInstance, logos, client) {
            $scope.selectedLogo = '';
            $scope.logos = logos;

            var getSelected = function(logoUrl) {
                angular.forEach($scope.logos, function(logo) {
                    if (logo.image === logoUrl) {
                        logo.selected = true;
                    } else {
                        logo.selected = false;
                    }
                });
            };

            // initially set our selected which is bound to model
            if (client && client.logo) getSelected(client.logo);    

            $scope.selectLogo = function(logo) {
                getSelected(logo.image);
                $scope.selectedLogo = logo.image;
            };

            $scope.ok = function () {
                $modalInstance.close($scope.selectedLogo);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
    }
]);