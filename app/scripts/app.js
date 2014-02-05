'use strict';

var techRadarApp = angular.module('techradarApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.bootstrap'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/vote', {
                templateUrl: 'views/vote.html',
                controller: 'VoteCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
