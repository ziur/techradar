'use strict';

var techRadarApp = angular.module('techRadarApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.bootstrap',
         'http-auth-interceptor'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'newRadar'
            })
            .when('/current', {
                templateUrl: 'views/main.html',
                controller: 'currentSeason'
            })
            .when('/new-radar', {
                templateUrl: 'views/newRadar.html',
                controller: 'newRadar'
            })
            .when('/vote', {
                templateUrl: 'views/vote.html',
                controller: 'VoteController'
            })
            .when('/radar-wip', {
                templateUrl: 'views/radar-wip.html',
                controller: 'RadarsWIPCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
