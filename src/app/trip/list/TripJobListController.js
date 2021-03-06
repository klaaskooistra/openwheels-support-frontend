'use strict';

angular.module('openwheels.trip.list', [])
.controller('TripJobsListController', function ($scope, jobs, eventSourceService, ccomeService){
  function update_job(event) {
    var eventData = JSON.parse(event.data),
        findPos = function (eventData) {
          for(var key in $scope.jobs) {
            if($scope.jobs[key].job.id === eventData.job_id) {
              return key;
            }
          }
          return false;
        },
        key = findPos(eventData);

    if(key) {
      if(eventData.job_status === 'success') {
        $scope.jobs[key].job.status = 'success';
        delete $scope.jobs[key];
        
        return;
      }
//      
//      ccomeService.getState({state: $scope.jobs[key].id})
//      .then(function (data) {
//        $scope.jobs[key] = data;
//      });
//      
//      return;
    }
    
    ccomeService.unfinishedJobs().then(function (data) {
      $scope.jobs = data;
    });
  }
  eventSourceService.addEventListener('openwheels.ccome.jobstate_event', update_job);
  $scope.jobs = jobs;
});