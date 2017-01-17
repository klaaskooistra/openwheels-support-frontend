'use strict';

angular.module('openwheels.resource.show', [
  'openwheels.resource.show.summary',
  'openwheels.resource.show.rating',
  'openwheels.resource.show.members',
  'openwheels.resource.show.discount',
  'openwheels.resource.show.discount.create',
  'openwheels.resource.show.boardcomputer',
  'openwheels.resource.show.log',
  'openwheels.resource.show.revisions',
  'openwheels.resource.show.tripdata'
])

.controller('ResourceShowController', function ($scope, $stateParams, $uibModal, 
  alertService, dialogService, resourceService, resource, settingsService, 
  FRONT_RENT, FRONT_SWITCHUSER) {
  $scope.resource = resource;
  $scope.frontResources = settingsService.settings.server + FRONT_RENT + '/' + ( resource.city ? resource.city : 'onbekend' ) + '/' + resource.id + '/wijzigen' + FRONT_SWITCHUSER;


  resourceService.getParkingpermits({
    resource: resource.id
  }).then(function (permits) {
    $scope.permits = permits;
  }); 

  $scope.bookResource = function(resource){
    $uibModal.open({
      templateUrl: 'trip/create/trip-create.tpl.html',
      windowClass: 'modal--xl',
      controller: 'TripCreateController',
      resolve: {
        resource: function () {
          return resource;
        },
        person: function () {
          return {};
        }
      }
    });
  };

  $scope.removeResource = function(resource) {
    dialogService.showModal({}, {
      closeButtonText: 'Cancel',
      actionButtonText: 'OK',
      headerText: 'Are you sure?',
      bodyText: 'Do you really want to remove ' + resource.alias + '?'
    })
    .then(function(){
      resourceService.remove({id: resource.id})
        .then(
        function(returnedResource){
          $scope.resource = returnedResource;
          alertService.add('success', 'Resource successfully removed.', 2000);
        },
        function(error){
          alertService.add('danger', 'Remove resource failed: ' + error.message, 5000);
        });
    });

  };
  
  $scope.addParkingpermit = function(resource) {
    dialogService.showModal({
      templateUrl: 'resource/show/parkingpermit.tpl.html'
    }, {
      closeButtonText: 'Cancel',
      actionButtonText: 'OK',
      headerText: 'Are you sure?',
      bodyText: 'Do you really want to create a parking permit for  ' + resource.alias + '?',
      cities: ['Den Haag', 'Rijswijk', 'Groningen', 'Haarlem', 'Leiden', 'Nijmegen', 'Utrecht']
    }).then(function (city){
      return resourceService.createParkingpermit({resource: resource.id, city: city});
    }).then(function (permit) {
      alertService.add('success', 'Parkingpermit created.', 2000);
      $scope.permits.push(permit);
    }, function(error) {
      alertService.add('danger', 'parking permit not created: ' + error.message, 5000);
    });
  };
  
  $scope.rmParkingpermit = function(permits) {
    dialogService.showModal({}, {
      closeButtonText: 'Cancel',
      actionButtonText: 'OK',
      headerText: 'Are you sure?',
      bodyText: 'Do you really want to remove the parking permit for  ' + resource.alias + '?'
    }).then(function (){
      return resourceService.removeParkingpermit({parkingpermit: permits[0].id});
    }).then(function () {
      alertService.add('success', 'Parkingpermit removed.', 2000);
      $scope.permits = [];
    }, function(error) {
      alertService.add('danger', 'parking permit not removed: ' + error.message, 5000);
    });
  };
})

;
