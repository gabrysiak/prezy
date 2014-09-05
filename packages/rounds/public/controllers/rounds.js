'use strict';

angular.module('mean').controller('RoundsController', ['$scope', '$stateParams', '$location', '$log', 'Global', 'Rounds', 'Concepts', 'FlashService', '$timeout',
    function($scope, $stateParams, $location, $log, Global, Rounds, Concepts, FlashService, $timeout) {
        $scope.global = Global;

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
                roundId: $stateParams.roundId
            }, function(concepts) {
                $scope.concepts = concepts;
                $scope.findOne();
            });
        };

        // $scope.removeConcept = function(concept) {
        //     Concepts.delete({
        //         conceptId: concept._id
        //     }, function(concept){
        //         // remove concept from scope
        //         $scope.concepts = _.without($scope.concepts, _.findWhere($scope.concepts, {_id: concept._id}));
        //     });
        // };
    }
]);