'use strict';

angular.module('techradarApp')
  .controller('newRadar', function ($scope) {
        $scope.dt = new Date();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
  });
