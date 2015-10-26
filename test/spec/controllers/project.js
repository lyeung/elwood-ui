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
      buildJobResource,
      clearValidationMessages;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, BuildJobResource, ClearValidationMessages) {
      scope = $rootScope.$new();
      buildJobResource = BuildJobResource;
      clearValidationMessages = ClearValidationMessages;
      httpBackend = $httpBackend;

      BuildJobCtrl = $controller('BuildJobCtrl', {
        $scope: scope,
        BuildJobResource: buildJobResource,
        ClearValidationMessages: clearValidationMessages
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
      expect(scope.model.status).toBeUndefined();

      // TODO: rework on this scenario
      scope.validationMessages = ['error1'];

      httpBackend.expectPOST(url).respond(mockData);
      scope.saveProjectForm();
      httpBackend.flush();

      expect(scope.model.key).toEqual('KEY');
      expect(scope.validationMessages).not.toBe(null);
      //expect(scope.validationMessages.length).toEqual(0);

      expect(scope.model.status.success).toBeTruthy();
      expect(scope.model.status.message).toEqual("Successfully saved changes");

      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });
  });
});
