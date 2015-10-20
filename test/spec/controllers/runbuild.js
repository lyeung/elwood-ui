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
 * Created by lyeung on 27/09/2015.
 */

'use strict';

describe('Controller: RunBuildJobCtrl', function () {

  // load the controller's module
  beforeEach(module('elwoodUiApp'));

  var
    scope,
    httpBackend;

  describe('RunBuildJobCtrl', function () {
    var RunBuildJobCtrl,
      CommonCtrl,
      toKeyCount,
      timeout,
      runBuildJobResource;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $timeout, $httpBackend,
                                RunBuildJobResource, ToKeyCount) {
      scope = $rootScope.$new();
      runBuildJobResource = RunBuildJobResource;
      timeout = $timeout;
      toKeyCount = ToKeyCount;
      httpBackend = $httpBackend;
      CommonCtrl = $controller('CommonCtrl', {
        $scope: scope,
        $timeout: timeout,
        RunBuildJobResource: runBuildJobResource,
        ToKeyCount: toKeyCount
      });
      RunBuildJobCtrl = $controller('RunBuildJobCtrl', {
        $scope: scope,
        $timeout: timeout,
        RunBuildJobResource: runBuildJobResource
      });
    }));

    it('should run build job', function () {
      var buildUrl = 'http://localhost:8080/runBuildJob';
      var key = {
        'key': 'KEY'
      };
      scope.model = {};
      scope.model.buildResults = [];
      scope.project = key;

      var mockRunBuildJobResponse = {
        'keyCountTuple': {
          'key': 'KEY',
          'count': 123
        },
        'buildResultResponse': {
          'keyCountTuple': {
            'key': 'KEY',
            'count': 123
          },
          'buildStatus': 'IN_PROGRESS',
          'startRunDate': new Date(),
          'finishRunDate': null
        }
      };
      httpBackend.when('POST', buildUrl).respond(mockRunBuildJobResponse);

      //var mockGetBuildJobResponse = {
      //  'keyCount': {
      //    'key': 'KEY',
      //    'count': 123
      //  },
      //  'status': 'SUCCESS',
      //  'content': 'hello\nworld',
      //  'redirectUrl': ''
      //};
      //httpBackend.when('GET', buildLogUrl).respond(mockGetBuildJobResponse);

      expect(scope.buildLog).not.toBeNull();
      //expect(scope.buildLog.length).toBeFalsy();

      scope.build(scope.project);
      //scope.build(scope.project);

      httpBackend.flush();

      // TODO: add tests to trigger timer
      //timeout.flush();

      //expect(scope.buildKeys.length).toEqual(2);
      //expect(scope.buildLog).toContain("1:hello");
      //expect(scope.buildLog).toContain("2:world");

      expect(scope.model.buildResults).not.toBe(null);
      expect(scope.model.buildResults['KEY'].length).toEqual(1);
      expect(scope.model.buildResults['KEY'][0].keyCountTuple.key).toEqual('KEY');
      expect(scope.model.buildResults['KEY'][0].keyCountTuple.count).toEqual(123);
      expect(scope.model.buildResults['KEY'][0].buildStatus).toEqual('IN_PROGRESS');
      expect(scope.model.buildResults['KEY'][0].startRunDate).not.toBe(null);
      expect(scope.model.buildResults['KEY'][0].finishRunDate).toBe(null);

      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });
  });
});
