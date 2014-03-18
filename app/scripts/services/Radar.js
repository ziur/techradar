'use strict';

var techradarApp = angular.module('techRadarApp', ['ngResource']);

techradarApp.factory('TechRadar', ['$resource',
  function($resource){
    return $resource('techradar/:id', {}, {
      query: {method:'GET', params:{id:'phones'}, isArray:true}
    });
  }]);


