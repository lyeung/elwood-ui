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

'use strict';

describe('Controller: ProjectCtrl', function () {

  // load the controller's module
  beforeEach(module('elwoodUiApp'));

  var
    scope,
    httpBackend;

  describe('BuildJobCtrl', function() {
    var BuildJobCtrl,
      buildJobResource;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, BuildJobResource) {
      scope = $rootScope.$new();
      buildJobResource = BuildJobResource;
      httpBackend = $httpBackend;
      BuildJobCtrl = $controller('BuildJobCtrl', {
        $scope: scope,
        BuildJobResource: buildJobResource
      });
    }));

    it('should initial project model', function () {
      expect(scope.model).not.toBe(null);
      expect(Object.keys(scope.model).length).toEqual(10);
      expect(scope.model.key).toEqual('');
      expect(scope.model.name).toEqual('');
      expect(scope.model.description).toEqual('');
      expect(scope.model.buildFile).toEqual('');
      expect(scope.model.buildCommand).toEqual('');
      expect(scope.model.environmentVars).toEqual('');
      expect(scope.model.sourceUrl).toEqual('');
      expect(scope.model.identityKey).toEqual('');
      expect(scope.model.authenticationType).toEqual('PUBLIC_KEY_PASSPHRASE');
      expect(scope.model.passphrase).toEqual('');
    });

    it('should save project', function() {
      var url = 'http://localhost:8080/buildJob';
      var mockData = {
        'key': 'KEY123',
        'name': 'name'
      };

      scope.model.key = 'KEY';

      httpBackend.expectPOST(url).respond(mockData);
      scope.saveProjectForm();
      httpBackend.flush();

      expect(scope.model.key).toEqual('KEY');

      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });
  });


  describe('RunBuildJobCtrl', function() {
    var BuildArticleCtrl,
      timeout,
      runBuildJobResource;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $timeout, $httpBackend, RunBuildJobResource) {
      scope = $rootScope.$new();
      runBuildJobResource = RunBuildJobResource;
      timeout = $timeout;
      httpBackend = $httpBackend;
      BuildArticleCtrl = $controller('RunBuildJobCtrl', {
        $scope: scope,
        RunBuildJobResource: runBuildJobResource
      });
    }));

    it('should run build job', function() {
      var buildUrl = 'http://localhost:8080/runBuildJob';
      var buildLogUrl = 'http://localhost:8080/runBuildJob/KEY123';
      var mockData = {
        'key': 'KEY123'
      };

      scope.project = mockData;

      httpBackend.when('POST', buildUrl).respond(mockData);
      httpBackend.when('GET', buildLogUrl).respond("hello\nworld");

      expect(scope.buildLog).not.toBeNull();
      expect(scope.buildLog.length).toBeFalsy();

      scope.build(scope.project);

      httpBackend.flush();

      // TODO: add tests to trigger timer
      //timeout.flush();

      //expect(scope.buildLog.length).toEqual(2);
      //expect(scope.buildLog).toContain("1:hello");
      //expect(scope.buildLog).toContain("2:world");


      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });
  });
});
