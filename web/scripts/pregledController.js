myApp.controller('pregledController', function($scope, $rootScope, $http, $interval, graphDataService, dbService) {
  var promise = undefined;
  $scope.counts = [5, 10, 20, 50, 100];

  dbService.getDBDevices();


  $scope.Graph = function(){
    stopInterval();
    promise = $interval(function(){$scope.GetData()}, 2000, false);
  }

  $scope.GetData = function(){
    var device = $scope.selectedDevice;
    var count = $scope.selectedCount;
    if($scope.live == "YES"){
      dbService.getValuesFromDB(device, count, 0);
    }else if($scope.live == "NO" && $scope.time != undefined){
      var time = new Date(Date.parse($scope.time)).toISOString();
      dbService.getValuesFromDB(device, count, time);
    }else{
      graphDataService.setLive(false);
    }
    //check for new devices in db
    dbService.getDBDevices();
  };

  $scope.HandleData = function(){
    var data = dbService.getValues();
    if(data != undefined){
      $scope.info = undefined;
      var values = [];
      var timestamp = [];
      data.forEach(function(object){
        values.push(parseFloat(object.value));
        timestamp.push(object.date);
      });
      graphDataService.setValues(values, timestamp);
      graphDataService.setLive(true);
      $rootScope.$broadcast('graphData');
    }
    else{
      graphDataService.setLive(false);
      $scope.info = 'Nema podataka, provjeri upite!';
    }
  }

  var stopInterval = function(){
    if(angular.isDefined(promise)){
      $interval.cancel(promise);
      promise = undefined;
    }
  }

//eventi
  $scope.$on('$destroy', function(){stopInterval();});
  $scope.$on('devicesSet',function(){
    $scope.devices = dbService.getDevices();
  })
  $scope.$on('dataReady', function(){
    $scope.HandleData();
  })
});
