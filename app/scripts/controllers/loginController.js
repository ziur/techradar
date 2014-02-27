'use strict';

angular.module('techRadarApp')
.controller('LoginController', ['$scope', '$http', 'authService', 'loginService', function ($scope, $http, authService, loginService) {
    $scope.submit = function() {
        loginService.login().$promise.then(function() {
        authService.loginConfirmed();
      });
      
    }
  }]);