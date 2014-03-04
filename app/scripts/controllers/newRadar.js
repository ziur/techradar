'use strict';

techRadarApp
  .controller('newRadar', ['$scope', 'SeasonService', function ($scope, SeasonService) {
        $scope.dt = new Date();
        $scope.a = new Date();
        console.log('Process newRadar!')
        SeasonService.current().get(function(currentSeason) {
        	console.log('dddddd');
        	console.log(currentSeason);
		});

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };
  }]);
