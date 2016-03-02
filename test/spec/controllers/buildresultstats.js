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

describe('Controller: BuildResultStatsCtrl', function () {

  // load the controller's module
  beforeEach(module('elwoodUiApp'));

  var
    scope,
    httpBackend;

  var url = 'http://localhost:8080/buildResultStats/PRJ/10';

  var mockData = {
    successCount: 10,
    failedCount: 3,
    ignoredCount: 2
  };

  describe('BuildResultStatsCtrl', function() {
    var BuildResultStatsCtrl,
      buildResultStatsResource,
      toKeyCount,
      keyCount;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $compile,
      $httpBackend, BuildResultStatsResource, ToKeyCount) {

      scope = $rootScope.$new();
      httpBackend = $httpBackend;
      buildResultStatsResource = BuildResultStatsResource;
      toKeyCount = ToKeyCount;
      BuildResultStatsCtrl = $controller('BuildResultStatsCtrl', {
        $scope: scope,
        BuildResultStatsResource: buildResultStatsResource,
        ToKeyCount: toKeyCount
      });

      keyCount = {
        key: 'PRJ',
        count: '10'
      };
    }));

    it('should display when status is SUCCEEDED', function() {
      scope.status = 'SUCCEEDED';

      expect(scope).toBeDefined();
      expect(scope.toggle).toBeFalsy();
      expect(scope.isShowBuildResultStats(keyCount)).toBeFalsy();
      expect(scope.buildResultStats).toBeUndefined();

      httpBackend.when('GET', url).respond(mockData);
      expect(buildResultStatsResource).toBeDefined();
      scope.getBuildResultStats(keyCount);
      httpBackend.flush();

      expect(scope.toggle).toBeTruthy();
      expect(scope.isShowBuildResultStats(keyCount)).toBeTruthy();
      expect(scope.buildResultStats).toBeDefined();
      expect(scope.buildResultStats[toKeyCount(keyCount)].successCount).toEqual(10);
      expect(scope.buildResultStats[toKeyCount(keyCount)].failedCount).toEqual(3);
      expect(scope.buildResultStats[toKeyCount(keyCount)].ignoredCount).toEqual(2);

      scope.getBuildResultStats(keyCount);
      httpBackend.flush();

      expect(scope.toggle).toBeFalsy();
      expect(scope.isShowBuildResultStats(keyCount)).toBeFalsy();
      expect(scope.buildResultStats).toBeDefined();
      expect(scope.buildResultStats[toKeyCount(keyCount)].successCount).toEqual(10);
      expect(scope.buildResultStats[toKeyCount(keyCount)].failedCount).toEqual(3);
      expect(scope.buildResultStats[toKeyCount(keyCount)].ignoredCount).toEqual(2);
    });

    it('should display when status is FAILED', function() {
      scope.status = 'FAILED';

      expect(scope).toBeDefined();
      expect(scope.toggle).toBeFalsy();
      expect(scope.isShowBuildResultStats(keyCount)).toBeFalsy();
      expect(scope.buildResultStats).toBeUndefined();

      httpBackend.when('GET', url).respond(mockData);
      expect(buildResultStatsResource).toBeDefined();
      scope.getBuildResultStats(keyCount);
      httpBackend.flush();

      expect(scope.toggle).toBeTruthy();
      expect(scope.isShowBuildResultStats(keyCount)).toBeTruthy();
      expect(scope.buildResultStats).toBeDefined();
      expect(scope.buildResultStats[toKeyCount(keyCount)].successCount).toEqual(10);
      expect(scope.buildResultStats[toKeyCount(keyCount)].failedCount).toEqual(3);
      expect(scope.buildResultStats[toKeyCount(keyCount)].ignoredCount).toEqual(2);


      scope.getBuildResultStats(keyCount);
      httpBackend.flush();

      expect(scope.toggle).toBeFalsy();
      expect(scope.isShowBuildResultStats(keyCount)).toBeFalsy();
      expect(scope.buildResultStats).toBeDefined();
      expect(scope.buildResultStats[toKeyCount(keyCount)].successCount).toEqual(10);
      expect(scope.buildResultStats[toKeyCount(keyCount)].failedCount).toEqual(3);
      expect(scope.buildResultStats[toKeyCount(keyCount)].ignoredCount).toEqual(2);
    });

    it('should not display when status is IN_PROGRESS', function() {
      scope.status = 'IN_PROGRESS';

      expect(scope).toBeDefined();
      expect(scope.toggle).toBeFalsy();
      expect(scope.isShowBuildResultStats(keyCount)).toBeFalsy();
      expect(scope.buildResultStats).toBeUndefined();

      httpBackend.when('GET', url).respond(mockData);
      expect(buildResultStatsResource).toBeDefined();
      scope.getBuildResultStats(keyCount);
      httpBackend.flush();

      expect(scope.toggle).toBeTruthy();
      expect(scope.isShowBuildResultStats(keyCount)).toBeFalsy();
      expect(scope.buildResultStats).toBeUndefined();


      scope.getBuildResultStats(keyCount);
      httpBackend.flush();

      expect(scope.toggle).toBeFalsy();
      expect(scope.isShowBuildResultStats(keyCount)).toBeFalsy();
      expect(scope.buildResultStats).toBeUndefined();
    });
  });
});
