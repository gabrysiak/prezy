'use strict';

angular.module('mean').controller('ProjectsController', ['$scope', '$q', '$rootScope', '$stateParams', '$location', '$log', '$modal', 'Global', 'Clients', 'Projects', 'Rounds', 'Concepts', 'ShortUrl', 'Tooltips', 'FlashService', '$timeout',
    function($scope, $q, $rootScope, $stateParams, $location, $log, $modal, Global, Clients, Projects, Rounds, Concepts, ShortUrl, Tooltips, FlashService, $timeout) {
        $scope.global = Global;

        // get tooltips
        Tooltips.getTooltips('Projects').then(function(tooltips) {
            $scope.tooltips = tooltips;
        }, function(err) {
            console.log(err);
        });

        // get client from query string
        var searchClient = $location.search().clientId;

        // populate the clients dropdown
        Clients.query(function(clients) {
            $scope.clients = [];
            angular.forEach(clients, function(client) {
                $scope.clients.push({
                    value: client._id,
                    text: client.title
                });
            });

            // check if client auto populated
            if (searchClient) $scope.client = searchClient;
        });

        $scope.hasAuthorization = function(project) {
            if (!project || !project.user) return false;
            return $scope.global.isAdmin || project.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                var project = new Projects({
                    title: this.title,
                    content: this.content,
                    client: this.client
                });
                project.$save(function(response) {
                    $location.path('projects');
                });

            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(project) {
            if (project) {
                project.$remove();

                for (var i in $scope.projects) {
                    if ($scope.projects[i] === project) {
                        $scope.projects.splice(i, 1);
                    }
                }
            } else {
                $scope.project.$remove(function(response) {
                    $location.path('projects');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var project = $scope.project;

                project.$update(function() {
                    // $location.path('projects/' + project._id);
                    $location.path('projects');
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            if (!searchClient) {
                Projects.query(function(projects) {         
                    $scope.projects = projects;
                    return;
                });
            }
            Clients.projects({
                clientId: searchClient
            }, function(projects) {
                $scope.projects = projects;
            });
        };


        $scope.findOne = function() {
            Projects.get({
                projectId: $stateParams.projectId
            }, function(project) {
                $scope.$watch('clients', function(clients){
                    if (!clients) return;
                    $scope.project = project;
                }, true);
            });
        };

        $scope.findConcepts = function() {
            Projects.concepts({
                projectId: $stateParams.projectId
            }, function(concepts) {
                $scope.concepts = concepts;
                $scope.findOne();
            });
        };

        $scope.findRounds = function() {
            Projects.rounds({
                projectId: $stateParams.projectId,
                clientId: searchClient
            }, function(rounds) {
                var uniqRounds = _.uniq(rounds, function(item, key, _id) {
                    return item._id;
                });
                $scope.rounds = uniqRounds;
                $scope.findOne();
            });
        };

        $scope.duplicateRound = function(round) {
            if (!round) return;

            var duplicateRound = new Rounds({
                title: round.title,
                content: round.content,
                round: round.round,
                client: round.client,
                project: round.project
            });

            duplicateRound.$save(function(newRound) {
                // push new round into scope
                $scope.rounds.push(newRound);

                // find and duplicate scopes
                Concepts.query({
                    round: round._id,
                    client: searchClient,
                    project: $scope.project._id
                }, function(concepts) {
                    angular.forEach(concepts, function(concept) {
                        ShortUrl.getBitlyUrl(concept._id)
                            .then(function(url) {
                                var conceptDuplicate = new Concepts({
                                    title: concept.title,
                                    slides: concept.slides,
                                    client: concept.client._id,
                                    project: concept.project._id,
                                    round: newRound._id,
                                    shortUrl: url
                                });
                                conceptDuplicate.$save(function(newConcept) {
                                    // do something on success
                                });
                            }, function (err) {
                                console.log(err);
                            });
                    }); 
                }); 
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

        $scope.removeRound = function(round) {
            
            var modalInstance = $modal.open({
                templateUrl: 'projects/views/partials/modal-confirm.html',
                controller: ModalInstanceController,
                resolve: {
                    round: function () {
                        return round;
                    }
                }
            });

            modalInstance.result.then(function (concepts) {

                $scope.selected = concepts;

                Rounds.delete({
                    roundId: round._id
                }, function(round){
                    // remove round from scope
                    $scope.rounds = _.without($scope.rounds, _.findWhere($scope.rounds, {_id: round._id}));

                    angular.forEach(concepts, function(concept) {
                        $scope.removeConcept(concept);
                    });
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        var ModalInstanceController = function ($scope, $modalInstance, round) {
            $scope.round = round;
            
            Concepts.query({
                round: round._id
            }, function(concepts) {
                $scope.concepts = concepts;
            });

            $scope.ok = function () {
                $modalInstance.close($scope.concepts);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
    }
]);