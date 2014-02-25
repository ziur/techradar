/*
techRadarApp.run(function($rootScope) {
    $('.dropdown-menu').find('form').click(function (e) {
        console.log('before click');
        e.stopPropagation();
        console.log('after click');
    });
});
*/
techRadarApp.directive('loginPopUp', ['loginService', function(loginService) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        scope: {},
        controller: function($scope) {
            $scope.user = {};

            $scope.login = function() {
                $('.dropdown-menu').hide();
                console.log('Before loggin');
                loginService.login({'userName':$scope.user.name, 'password':$scope.user.password});
                console.log('After loggin');
            };
        },
        templateUrl: 'views/directives/loginPopUp.html',
        link: function(scope , element){
            $('.dropdown-menu').find('form').click(function (e) {
                e.stopPropagation();
            });

            /*element.bind("click", function(e){
                e.stopPropagation();
            });*/
        }
    };
}]);