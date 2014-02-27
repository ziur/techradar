'use strict';

techRadarApp.factory('CurrentSeasonService', ['$resource', 'Settings', function($resource, Settings){
    var loginURL = Settings.apiUri + '/protected/seasons/current';
    return $resource(loginURL, {}, {
        //login: {method:'POST', params:{userName: '@user.name', password:'@user.password'}, headers: {
        login: {method:'POST', params:{userName: '@userName', password:'@password'}},
      logout: {method:'POST', params:{key: '@key'}}
    });
  }]);