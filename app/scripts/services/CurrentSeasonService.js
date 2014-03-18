'use strict';

techRadarApp.factory('CurrentSeasonService', ['$resource', 'Settings', function($resource, Settings){
    var loginURL = Settings.apiUri + '/protected/seasons/current';
    return $resource(loginURL, {}, {});
  }]);