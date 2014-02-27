'use strict';

techRadarApp.factory('SeasonService', ['$resource', 'Settings', function($resource, Settings){
    var seasonURL = Settings.apiUri + '/protected/seasons';
    return {
        current : function()
        {
            var currentSeasonURL = seasonURL + '/current';
            return $resource(currentSeasonURL, {}, {
                //login: {method:'POST', params:{userName: '@user.name', password:'@user.password'}, headers: {
                login: {method:'POST', params:{userName: '@userName', password:'@password'}},
                logout: {method:'POST', params:{key: '@key'}}
            });
        }
    }
}]);