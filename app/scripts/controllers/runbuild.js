/*
 *
 *  Copyright (C) 2015 the original author or authors.
 *
 *  Licensed under the Apache License, Version 2.0 (the 'License');
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

/**
 * Created by lyeung on 19/09/2015.
 */
'use strict';
var app = angular.module('elwoodUiApp')
  .constant('RunBuildJobUrl', 'http://localhost:8080/runBuildJob/:key/:count')
  .factory('RunBuildJobResource', function ($resource, RunBuildJobUrl) {
    return $resource(RunBuildJobUrl, {}, {
      'get': {method: 'GET'},//, timeout: 2000 },
      'build': {method: 'POST'} //timeout: 2000 }
    });
  });

app.controller('RunBuildJobCtrl', function ($scope, $timeout, RunBuildJobResource) {
    $scope.build = function (project) {
      RunBuildJobResource.build({'key': project.key.key},
        function (successResult) {
          console.log(successResult);
          var keyCount = successResult.keyCountTuple;
          var keyCountStr = keyCount.key + '-' + keyCount.count;
          if (!$scope.buildKeys[keyCount.key]) {
            $scope.buildKeys[keyCount.key] = [];
          }

          $scope.buildKeys[keyCount.key].push(keyCountStr);
          //$scope.initBuildKeys(keyCount.key, $scope.model);
          $scope.addBuildResult(successResult.buildResultResponse, $scope.model);

          $timeout(function () {
            $scope.refreshBuildJob(keyCount, $scope.model);
          }, 3000);
        }, function (errorResult) {
          console.log(errorResult);
        }
      );
    };

    $scope.getDiagnostics = function () {
      var str = 'keys=';
      angular.forEach($scope.buildKeys, function (arr, elem) {
        str += elem + ',';
      });

      str += '\nlog=';
      angular.forEach($scope.buildLog, function (value, key) {
        str += key + ':' + value + ',';
      });
      $scope.diagnostics = str;
    };

    //$scope.addDiagnostics = function () {
    //  $scope.buildKeys['ELWP'] = [];
    //  $scope.buildKeys['ELWP'].push('ELWP-10');
    //  $scope.buildKeys['ELWP'].push('ELWP-11');
    //  $scope.buildKeys['WA'] = [];
    //  $scope.buildKeys['WA'].push('WA-30');
    //  $scope.buildLog['ELWP-10'] = [];
    //  $scope.buildLog['ELWP-10'].push('HOLA');
    //  $scope.buildLog['ELWP-10'].push('HELLO');
    //  $scope.buildLog['ELWP-11'] = [];
    //  $scope.buildLog['ELWP-11'].push('WORLD');
    //  $scope.buildLog['WA-30'] = [];
    //  $scope.buildLog['WA-30'].push('MUNDO');
    //};
  }
) ;
