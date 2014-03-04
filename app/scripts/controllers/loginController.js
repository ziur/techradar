'use strict';
techRadarApp.controller('LoginController', ['$scope', '$http', '$cookies', '$modal', '$log', 'authService', 'loginService',
    function ($scope, $http, $cookies, $modal, $log, authService, loginService) {

    var modalInstance;
    var ModalInstanceCtrl = function ($scope, $modalInstance) {
        $scope.user = {};

        $scope.login = function () {
            var payload = {'userName':$scope.user.name, 'password':$scope.user.password};
            loginService.login(payload).$promise.then(function(data) {
                 console.log('loginservice:');
                 console.log(data);
                 authService.loginConfirmed(data);
            });
        };

        $scope.cancel = function () {
            alert('You will be redirected to the home');
        };
    };

    $scope.$on('event:auth-loginRequired', function() {
        console.log('on event:event:auth-loginRequired ');
        modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: ModalInstanceCtrl
      });
    });

    $scope.$on('event:auth-loginConfirmed', function(event, data) {
        console.log('on event:event:auth-loginConfirmed ');
        $cookies.techradarAuth ='Bearer ' + data.token;
        modalInstance.close();

    });
}
]);


techRadarApp.factory('httpRequestInterceptor', ['$cookies', function ($cookies) {
  return {
    request: function (config) {
        if (typeof $cookies.techradarAuth == 'undefined'){
            return config;
        }

      var token = $cookies.techradarAuth;
      config.headers['Authorization'] = token;
      return config;
    }
  };
}]);

techRadarApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
});
