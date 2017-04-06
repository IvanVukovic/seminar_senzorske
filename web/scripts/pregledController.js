myApp.controller('pregledController', function($scope, $http, $interval, graphDataService, dbService) {
  var promise = undefined;
  dbService.getDBDevices();

  $scope.GetData = function(Device, count){
    //console.log("live :" + $scope.live + " model: " + $scope.model)
      if($scope.live == "YES"){
        $http.get("/getValues/?name=" + Device + "&count=" + count + "&live=on")
         .then(function(response){
           $scope.HandleData(response.data);
         });
      }else if($scope.live == "NO" && $scope.model != undefined){
          var time = new Date(Date.parse($scope.model)).toISOString();
          //console.log(new Date(Date.parse($scope.model)));
          $http.get("/getValues/?name=" + Device + "&count=" + count + "&time=" + time)
           .then(function(response){
              $scope.HandleData(response.data);
            });
          //console.log(time);
      }else{
        graphDataService.setLive(false);
      }
      //check for new devices in db
      dbService.getDBDevices();
      $scope.devices = dbService.getDevices();
  };

  $scope.HandleData = function(data){
    if(data.length > 0){
      $scope.info = undefined;
      var values = [];
      var timestamp = [];
      data.forEach(function(object){
        values.push(parseFloat(object.value));
        timestamp.push(object.date);
      });
      graphDataService.setValues(values, timestamp);
      graphDataService.setLive(true);
    }
    else{
      graphDataService.setLive(false);
      $scope.info = 'Nema podataka, provjeri upite!';
    }
  }

  $scope.Graph = function(device, count){
    stopInterval();
    promise = $interval(function(){$scope.GetData(device, count)}, 2000, false, [device, count]);
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
    $scope.selectedDevice = $scope.devices[0];
    $scope.counts = [5, 10, 20, 50, 100];
  })
});
