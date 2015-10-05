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
  });

app.controller('CommonCtrl', function($scope, $timeout, RunBuildJobResource, ToKeyCount) {
  $scope.buildKeys = {};
  $scope.buildLog = {};

  var invokeRefreshTimer = function (keyCount, timerInMillis) {
    $timeout(function () {
      $scope.refreshBuildJob(keyCount);
    }, timerInMillis);
  };

  var isStatusDone = function (status) {
    return status === 'SUCCESS' || status === 'FAILED';
  };

  $scope.buildJobRefreshSuccessCallback = function (successResult) {
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
      invokeRefreshTimer(successResult.keyCount, 500);
    } else if (isStatusDone(successResult.status)) {
      console.log(successResult);
      var keyCount = successResult.keyCount;
      var keyCountStr = ToKeyCount(keyCount);
      if (keyCountStr in $scope.buildLog) {
        delete $scope.buildLog[keyCountStr];
      } else {
        console.error('unable to find ' + keyCountStr + ' from buildLog');
      }

      if (keyCount.key in $scope.buildKeys) {
        var keyCounts = $scope.buildKeys[keyCount.key];
        var indexElem = keyCounts.indexOf(keyCountStr);
        if (indexElem > -1) {
          keyCounts.splice(indexElem, 1);
        }

        if (!$scope.buildKeys.length) {
          delete $scope.buildKeys[keyCount.key];
        }
      } else {
        console.error('unable fo find ' + keyCountStr + ' from buildKeys');
      }
    }
  };

  $scope.buildJobRefreshErrorCallback = function (errorResult, keyCount) {
    console.log(errorResult);
    invokeRefreshTimer(keyCount, 500);
  };

  $scope.refreshBuildJob = function (keyCount) {
    RunBuildJobResource.get({key: keyCount.key, count: keyCount.count}).$promise.then(
      function (successResult) {
        return $scope.buildJobRefreshSuccessCallback(successResult);
      }, function (errorResult) {
        return $scope.buildJobRefreshErrorCallback(errorResult, keyCount);
      });
  };
});
