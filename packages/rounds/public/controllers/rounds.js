'use strict';

angular.module('mean').controller('RoundsController', ['$scope', '$stateParams', '$location', '$log', 'Global', 'Rounds', 'Concepts', 'FlashService', '$timeout',
    function($scope, $stateParams, $location, $log, Global, Rounds, Concepts, FlashService, $timeout) {
        $scope.global = Global;

        // get client from query string
        var searchClient = $location.search().clientId;
        // get project from query string
        var searchProject = $location.search().projectId;

        $scope.hasAuthorization = function(round) {
            if (!round || !round.user) return false;
            return $scope.global.isAdmin || round.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                var round = new Rounds({
                    title: this.title,
                    content: this.content
                });
                round.$save(function(response) {
                    $location.path('rounds');
                });

            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(round) {
            if (round) {
                round.$remove();

                for (var i in $scope.rounds) {
                    if ($scope.rounds[i] === round) {
                        $scope.rounds.splice(i, 1);
                    }
                }
            } else {
                $scope.round.$remove(function(response) {
                    $location.path('rounds');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var round = $scope.round;

                round.$update(function() {
                    // $location.path('rounds/' + round._id);
                    $location.path('rounds');
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Rounds.query(function(rounds) {         
                $scope.rounds = rounds;
            });
        };


        $scope.findOne = function() {
            Rounds.get({
                roundId: $stateParams.roundId
            }, function(round) {
                $scope.round = round;
            });
        };

        $scope.findConcepts = function() {
            Rounds.concepts({
                roundId: $stateParams.roundId,
                clientId: searchClient,
                projectId: searchProject
            }, function(concepts) {
                $scope.concepts = concepts;
                $scope.findOne();
            });
        };

        $scope.duplicate = function(round) {
            if (!round) return;

            Concepts.query({
                roundId: round._id,
                clientId: searchClient,
                projectId: searchProject
            }, function(concepts) {
                console.log(concepts);
            });
            // var conceptDuplicate = new Concepts({
            //     title: concept.title,
            //     slides: concept.slides,
            //     client: concept.client,
            //     project: concept.project,
            //     round: concept.round,
            //     shortUrl: null
            // });
            // conceptDuplicate.$save(function(response) {
            //     $scope.createShortUrl(response._id, true, function(shortUrl){
            //         response.shortUrl = shortUrl;
            //         $scope.concepts.push(response);
            //     });
            // });
        };
    }
]);