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

'use strict';

describe('Controller: CommonCtrl', function () {

  // load the controller's module
  beforeEach(module('elwoodUiApp'));

  var
    scope,
    httpBackend;

  describe('CommonCtrl', function() {
    var CommonCtrl,
      runBuildJobResource,
      getBuildKeysResource,
      getBuildResultsResource,
      toKeyCount;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend,
        RunBuildJobResource, GetBuildKeysResource, GetBuildResultsResource, ToKeyCount) {

      scope = $rootScope.$new();
      runBuildJobResource = RunBuildJobResource;
      getBuildKeysResource = GetBuildKeysResource;
      getBuildResultsResource = GetBuildResultsResource;
      toKeyCount = ToKeyCount;

      httpBackend = $httpBackend;
      CommonCtrl = $controller('CommonCtrl', {
        $scope: scope,
        RunBuildJobResource: runBuildJobResource,
        GetBuildKeysResource: getBuildKeysResource,
        GetBuildResultsResource: getBuildResultsResource,
        ToKeyCount: toKeyCount
      });
    }));

    it('should initial build keys', function () {
      scope.model = {};
      scope.model.buildResults = {};

      var KEY = 'KEY';
      var getBuildKeysUrl = 'http://localhost:8080/runBuildJob/buildKeys/' + KEY;
      var getBuildKeysResponse = {
        'key': {
          'key': KEY
        },
        //'buildResultResponse': {
        //  'keyCount': {
        //    'key': KEY,
        //    'count': '10'
        //  },
        //  'buildStatus': 'IN_PROGRESS',
        //  'startRunDate': new Date(),
        //  'endRunDate': null
        //}
        'keyCounts': [{
          'key': KEY,
          'count': 10
        }, {
          'key': KEY,
          'count': 11
        }]
      };
      httpBackend.when('GET', getBuildKeysUrl).respond(getBuildKeysResponse);

      var runBuildJobUrl1 = 'http://localhost:8080/runBuildJob/' + KEY + '/10';
      var runBuildJobResponse1 = {
        'keyCount': {
          'key': KEY,
          'count': 10
        },
        'status': 'RUNNING',
        'content': 'line1',
        'redirectUrl': 'redirectUrl'
      };
      httpBackend.when('GET', runBuildJobUrl1).respond(runBuildJobResponse1);

      var runBuildJobUrl2 = 'http://localhost:8080/runBuildJob/' + KEY + '/11';
      var runBuildJobResponse2 = {
        'keyCount': {
          'key': KEY,
          'count': 11
        },
        'status': 'RUNNING',
        'content': 'line2',
        'redirectUrl': 'redirectUrl'
      };
      httpBackend.when('GET', runBuildJobUrl2).respond(runBuildJobResponse2);

      var getBuildResultUrl = 'http://localhost:8080/buildResult/' + KEY;
      var getBuildResultResponse = {
        'keyCountTuple': {
          'key': KEY,
          'count': '10'
        },
        'buildStatus': 'IN_PROGRESS',
        'startRunDate': new Date(),
        'endRunDate': null
      };
      var getBuildResultsResponse = {
        'keyTuple': {
          'key': KEY
        },
        'buildResultResponses': [ getBuildResultResponse ]
      };
      httpBackend.when('GET', getBuildResultUrl).respond(getBuildResultsResponse);

      scope.initBuildKeys(KEY, scope.model);
      httpBackend.flush();


      expect(scope.buildKeys).not.toBe(null);
      expect(scope.buildKeys[KEY]).not.toBe(null);
      expect(scope.buildKeys[KEY].length).toEqual(2);
      expect(scope.buildKeys[KEY][0]).toEqual('KEY-10');
      expect(scope.buildKeys[KEY][1]).toEqual('KEY-11');
      expect(scope.model.buildResults).not.toBe(null);
      expect(scope.model.buildResults[KEY].length).toEqual(1);
      expect(scope.model.buildResults[KEY][0]).toEqual(getBuildResultResponse);

      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });
  });


  //describe('RunBuildJobCtrl', function() {
  //  var BuildArticleCtrl,
  //    timeout,
  //    runBuildJobResource;
  //
  //  // Initialize the controller and a mock scope
  //  beforeEach(inject(function ($controller, $rootScope, $timeout, $httpBackend, RunBuildJobResource) {
  //    scope = $rootScope.$new();
  //    runBuildJobResource = RunBuildJobResource;
  //    timeout = $timeout;
  //    httpBackend = $httpBackend;
  //    BuildArticleCtrl = $controller('RunBuildJobCtrl', {
  //      $scope: scope,
  //      RunBuildJobResource: runBuildJobResource
  //    });
  //  }));
  //
  //  it('should run build job', function() {
  //    var buildUrl = 'http://localhost:8080/runBuildJob';
  //    var buildLogUrl = 'http://localhost:8080/runBuildJob/KEY123';
  //    var mockData = {
  //      'key': 'KEY123'
  //    };
  //
  //    scope.project = mockData;
  //
  //    httpBackend.when('POST', buildUrl).respond(mockData);
  //    httpBackend.when('GET', buildLogUrl).respond("hello\nworld");
  //
  //    expect(scope.buildLog).not.toBeNull();
  //    expect(scope.buildLog.length).toBeFalsy();
  //
  //    scope.build(scope.project);
  //
  //    httpBackend.flush();
  //
  //    // TODO: add tests to trigger timer
  //    //timeout.flush();
  //
  //    //expect(scope.buildLog.length).toEqual(2);
  //    //expect(scope.buildLog).toContain("1:hello");
  //    //expect(scope.buildLog).toContain("2:world");
  //
  //
  //    httpBackend.verifyNoOutstandingExpectation();
  //    httpBackend.verifyNoOutstandingRequest();
  //  });
  //});
});
