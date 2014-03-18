'use strict';

techRadarApp.factory('loginService', ['$resource', 'Settings',
  function($resource, Settings){
    return $resource(Settings.apiUri + '/login', {}, {
        login: {method:'POST', params:{userName: '@userName', password:'@password'}},
        logout: {method:'POST', params:{key: '@key'}}
    });
  }]);