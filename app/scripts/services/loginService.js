'use strict';

var techradarApp = angular.module('techradarApp', ['ngResource']);

techradarApp.factory('loginService', ['$resource',
  function($resource){
    return $resource('http://10.31.2.83:9090/login', {}, {
      login: {method:'POST', params:{userName: '@userName', password:'@password'}, headers: {
          'Content-Type': 'application/json'
      }},
      logout: {method:'POST', params:{key: '@key'}}
    });
  }]);