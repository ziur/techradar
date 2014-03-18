'use strict';

techRadarApp
  .controller('currentSeason', ['$scope', 'SeasonService', function ($scope, SeasonService) {
        $scope.dt = new Date();
        $scope.a = new Date();
        SeasonService.current().get(function(currentSeason) {
        	console.log(currentSeason);
		});

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
  }]);
