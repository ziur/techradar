'use strict';

techRadarApp.factory('SeasonService', ['$resource', 'Settings', function($resource, Settings){
    var seasonURL = Settings.apiUri + '/protected/seasons';
    return {
        current : function()
        {
            var currentSeasonURL = seasonURL + '/current';
            return $resource(currentSeasonURL, {}, {});
        }
    }
}]);