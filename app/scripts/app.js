'use strict';

/**
 * @ngdoc overview
 * @name elwoodUiApp
 * @description
 * # elwoodUiApp
 *
 * Main module of the application.
 */
angular
  .module('elwoodUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/project', {
        templateUrl: 'views/project.html',
        controller: 'BuildJobCtrl',
        controllerAs: 'project'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
