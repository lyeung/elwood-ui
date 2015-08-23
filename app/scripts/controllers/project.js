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
  .constant('BuildJobUrl', 'http://localhost:8080/buildJob/:key')
  .constant('RunBuildJobUrl', 'http://localhost:8080/runBuildJob/:key')
  .constant('ProjectsUrl', 'http://localhost:8080/projects/:pageNumber')
  .factory('BuildJobResource', function($resource, BuildJobUrl) {
    return $resource(BuildJobUrl, {}, {
      'get': { method: 'GET', timeout: 2000 },
      'save': { method: 'POST'}//, timeout: 2000 }
    });
  })
  .factory('RunBuildJobResource', function($resource, RunBuildJobUrl) {
    return $resource(RunBuildJobUrl, {}, {
      'get': { method: 'GET'},//, timeout: 2000 },
      'build': { method: 'POST'}//, timeout: 2000 }
    });
  })
  .factory('ProjectsResource', function($resource, ProjectsUrl) {
    return $resource(ProjectsUrl, {}, {
      'get': { method: 'GET', timeout: 2000 }
    });
  })
  .controller('ProjectsCtrl', function($scope, ProjectsResource) {
    var newModel = function() {
      return {
        'projects': []
      };
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
  .controller('BuildJobCtrl', function($scope, BuildJobResource) {
    var newModel = function () {
      return {
        'key': '',
        'name': '',
        'description': '',
        'buildFile': '',
        'buildCommand': '',
        'environmentVars': '',
        'sourceUrl': '',
        'identityKey': '',
        'authenticationType': 'PUBLIC_KEY_PASSPHRASE',
        'passphrase': ''
      };
    };

    $scope.model = newModel();
    //$scope.getByKey = function (key) {
    //  console.log(ProjectResource.get({key: key}));
    //};
    $scope.saveProjectForm = function () {
      BuildJobResource.save($scope.model, function (successResult) {
        console.log(successResult);
      }, function (errorResult) {
        console.log(errorResult);
      });
    };
  })
  .controller('RunBuildJobCtrl', function($scope, $timeout, RunBuildJobResource) {
    $scope.buildLog = [];

    $scope.build = function(project) {
      $scope.project = project;
      $scope.isBuilding = true;
      $scope.lineNumber = 1;

      RunBuildJobResource.build({'key': project.key},
      function(successResult) {
        console.log(successResult);
      }, function(errorResult) {
        console.log(errorResult);
      });

      var refresh = function() {
        RunBuildJobResource.get({key: project.key}).$promise.then(function (successResult) {
          console.log(successResult);
          if (successResult.content) {
            $scope.buildLog = [];
            angular.forEach(successResult.content.split('\n'), function(value, key) {
              this.push(key+":" + value);
            }, $scope.buildLog);
          }
          $timeout(refresh, 500);
        }, function(errorResult) {
          console.log(errorResult);
          $timeout(refresh, 500);
        });
      };

      //$interval(refresh, 10000);
      $timeout(refresh, 3000);

    };
  });
