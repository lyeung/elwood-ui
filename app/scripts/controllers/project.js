/**
 * Created by lyeung on 2/08/2015.
 */
'use strict';

/**
 * @ngdoc function
 * @name elwoodUiApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the elwoodUiApp
 */
angular.module('elwoodUiApp')
  .constant('ArticleUrl', 'http://localhost:8080/article/:key')
  .constant('ProjectsUrl', 'http://localhost:8080/projects/:pageNumber')
  .factory('ArticleResource', function($resource, ArticleUrl) {
    return $resource(ArticleUrl, {}, {
      'get': { method: 'GET', timeout: 2000 },
      'save': { method: 'POST', timeout: 2000 }
    });
  })
  .factory('ProjectsResource', function($resource, ProjectsUrl) {
    return $resource(ProjectsUrl, {}, {
      'get': { method: 'GET', timeout: 2000 }
    })
  })
  .controller('ProjectsCtrl', function($scope, ProjectsResource) {
    var newModel = function() {
      return {
        'projects': []
      }
    };

    $scope.model = newModel();
    $scope.getAllProjects = function() {
      ProjectsResource.get({}, function(successResult) {
        $scope.model.projects = successResult.projects;
      }, function(errorResult) {
        console.log(errorResult);
      });
    };

    $scope.getAllProjects();
    $scope.isNoProjectItems = function() {
      return !$scope.model.projects.length;
    };
  })
  .controller('ProjectCtrl', function($scope, ArticleResource) {
    var newModel = function() {
      return {
        'key': '',
        'name': '',
        'description': '',
        'buildFile': '',
        'buildCommand': '',
        'environmentVars': '',
        'workingDirectory': ''
      }
    };

    $scope.model = newModel();
    $scope.getByKey = function(key) {
      console.log(ProjectResource.get({key: key}));
    };
    $scope.saveProjectForm = function() {
      ArticleResource.save($scope.model, function(successResult) {
        console.log(successResult);
      }, function(errorResult) {
        console.log(errorResult);
      })
    }
  });
