'use strict';

angular.module('techRadarApp')
  .controller('newRadar', ['SeasonService', function ($scope, SeasonService) {
        $scope.dt = new Date();
        $scope. = new Date();


        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
  }]);
