
techRadarApp.run(function($rootScope) {
    $('.dropdown-menu').find('form').click(function (e) {
        e.stopPropagation();
    });
});

techRadarApp.directive('loginPopUp', ['loginService', function(loginService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        controller: function($scope) {
            $scope.user = {};

            $scope.login = function() {
                console.log('Before loggin');
                loginService.login({'userName':user.name, 'password':user.password})
                console.log('After loggin');
            };
        },
        templateUrl: 'views/directives/loginPopUp.html'
    };
}]);
