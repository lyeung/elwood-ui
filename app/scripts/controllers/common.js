/*
 *
 *  Copyright (C) 2015 the original author or authors.
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
 *  limitations under the License.
 *
 */

/**
 * Created by lyeung on 5/10/2015.
 */

'use strict';

var app = angular.module('elwoodUiApp')
  .factory('ToKeyCount', function() {
    return function (keyCount) {
      return keyCount.key + '-' + keyCount.count;
    };
  }).factory('ClearValidationMessages', function($parse) {
      return function(model, scope) {
        angular.forEach(model, function (value) {
          var validationMessage = $parse(value);
          validationMessage.assign(scope, '');
        });

        model = [];
      };
  }).constant('GetBuildResultsUrl', 'http://localhost:8080/buildResult/:key')
  .factory('GetBuildResultsResource', function($resource, GetBuildResultsUrl) {
    return $resource(GetBuildResultsUrl, {}, {
      'getBuildResults': {method: 'GET'}
    });
  }).constant('GetBuildKeysUrl', 'http://localhost:8080/runBuildJob/buildKeys/:key')
  .factory('GetBuildKeysResource', function($resource, GetBuildKeysUrl) {
    return $resource(GetBuildKeysUrl, {}, {
      'getBuildKeys': {method: 'GET'}
    });
  });

app.controller('CommonCtrl', function($scope, $timeout, RunBuildJobResource, GetBuildKeysResource, GetBuildResultsResource, ToKeyCount) {
  $scope.buildKeys = {};
  $scope.buildLog = {};

  var invokeRefreshTimer = function (keyCount, timerInMillis, model) {
    $timeout(function () {
      $scope.refreshBuildJob(keyCount, model);
    }, timerInMillis);
  };

  var isStatusDone = function (status) {
    return status === 'SUCCESS' || status === 'FAILED';
  };

  var buildJobRefreshSuccessCallback = function (successResult, model) {
    if (successResult.status === 'RUNNING') {
      if (successResult.content) {
        var lines = [];
        angular.forEach(successResult.content.split('\n'), function (value, key) {
          this.push(key + ':' + value);
        }, lines);
        //var keyCountStr = successResult.keyCount.key + '-' + successResult.keyCount.count;
        console.log(lines);
        $scope.buildLog[ToKeyCount(successResult.keyCount)] = lines;
      } else {
        console.log('redirecting ' + successResult.status + ': ' + successResult.redirectUrl);
      }
      invokeRefreshTimer(successResult.keyCount, 500, model);
    } else if (isStatusDone(successResult.status)) {
      console.log(successResult);
      var keyCount = successResult.keyCount;
      var keyCountStr = ToKeyCount(keyCount);
      if ($scope.buildLog) {
        if (keyCountStr in $scope.buildLog) {
         delete $scope.buildLog[keyCountStr];
        }
      } else {
        console.error('unable to find ' + keyCountStr + ' from buildLog');
      }

      if (keyCount.key in $scope.buildKeys) {
        var keyCounts = $scope.buildKeys[keyCount.key];
        var indexElem = keyCounts.indexOf(keyCountStr);
        if (indexElem > -1) {
          keyCounts.splice(indexElem, 1);
        }

        if (!$scope.buildKeys[keyCount.key].length) {
          delete $scope.buildKeys[keyCount.key];
        }
      } else {
        console.error('unable fo find ' + keyCountStr + ' from buildKeys');
      }
      model.buildResults[keyCount.key] = [];
      initBuildResults(keyCount.key, model);
    }
  };

  var buildJobRefreshErrorCallback = function (errorResult, keyCount, model) {
    console.log(errorResult);
    invokeRefreshTimer(keyCount, 500, model);
  };

  $scope.refreshBuildJob = function (keyCount, model) {
    RunBuildJobResource.get({key: keyCount.key, count: keyCount.count}).$promise.then(
      function (successResult) {
        return buildJobRefreshSuccessCallback(successResult, model);
      }, function (errorResult) {
        return buildJobRefreshErrorCallback(errorResult, keyCount, model);
      });
  };

  $scope.addBuildResult = function(buildResultResponse, model) {
    var key = buildResultResponse.keyCountTuple.key;
    if (!model.buildResults[key]) {
      model.buildResults[key] = [];
    }

    model.buildResults[key].push(buildResultResponse);
  };

  var initBuildResults = function(key, model) {
    GetBuildResultsResource.getBuildResults({'key': key}, function (successResult) {
      angular.forEach(successResult.buildResultResponses, function(elem) {
        $scope.addBuildResult(elem, model);
      });
    }, function (errorResult) {
      console.error('error: ' + errorResult);
    });
  };

  $scope.initBuildKeys = function(key, model) {
    GetBuildKeysResource.getBuildKeys({'key': key},
      function (successResult) {
        var key = successResult.key.key;

        angular.forEach(successResult.keyCounts, function(elem) {
          var keyCount = elem;
          if (!$scope.buildKeys[keyCount.key]) {
            $scope.buildKeys[keyCount.key] = [];
          }
          $scope.buildKeys[keyCount.key].push(ToKeyCount(keyCount));
          $scope.refreshBuildJob(keyCount, model);
        });

        initBuildResults(key, model);
      }, function(errorResult) {
        console.error("error:" + errorResult);
      });
  };
});
