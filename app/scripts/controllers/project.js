/*
 *
 * Copyright (C) 2015 the original author or authors.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
  //.constant('RunBuildJobUrl', 'http://localhost:8080/runBuildJob/:key/:count')
  .constant('ProjectsUrl', 'http://localhost:8080/projects/:pageNumber')
  .factory('BuildJobResource', function($resource, BuildJobUrl) {
    return $resource(BuildJobUrl, {}, {
      'get': {method: 'GET', timeout: 2000},
      'save': {method: 'POST'}//, timeout: 2000 }
    });
  })
  .factory('RunBuildJobResource', function($resource, RunBuildJobUrl) {
    return $resource(RunBuildJobUrl, {}, {
      'get': {method: 'GET'},//, timeout: 2000 },
      'build': {method: 'POST'}//, timeout: 2000 }
    });
  })
  .factory('ProjectsResource', function($resource, ProjectsUrl) {
    return $resource(ProjectsUrl, {}, {
      'get': {method: 'GET', timeout: 2000}
    });
  })
  .controller('ProjectsCtrl', function($scope, ProjectsResource) {
    var newModel = function() {
      return {
        'projects': [],
        'buildResults': {}
      };
    };

    $scope.model = newModel();
    $scope.getAllProjects = function() {
      ProjectsResource.get({}, function(successResult) {
        $scope.model.projects = successResult.projects;
        angular.forEach($scope.model.projects, function(elem) {
          $scope.initBuildKeys(elem.key.key, $scope.model);
        });
      }, function(errorResult) {
        console.log(errorResult);
      });
    };

    $scope.getAllProjects();
    $scope.isNoProjectItems = function() {
      return !$scope.model.projects.length;
    };
  })
  .controller('BuildJobCtrl', function($scope, $parse, BuildJobResource, ClearValidationMessages) {
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
    $scope.validationMessages = [];
    $scope.saveProjectForm = function () {
      ClearValidationMessages($scope.validationMessages, $scope);
      BuildJobResource.save($scope.model, function (successResult) {
        console.log(successResult);
        $scope.model.status = {
          'success': true,
          'message': 'Successfully saved changes'
        }
      }, function (errorResult) {
        console.log(errorResult);
        angular.forEach(errorResult.data, function(value) {
          if (value.logref) {
            var prefix = value.logref.replace('buildJob.', 'buildJobForm.');
            var expression = prefix + '.$error.validationMessage';
            $scope.validationMessages.push(expression);
            var validationMessage = $parse(expression);
            validationMessage.assign($scope, value.message);
          }
        });
      });
    };
  });
