myApp.controller('pitController',function($scope, $http, dbService){
  dbService.getDBDevices();

  $scope.dropDevice = function(){
    console.log("brisem " + $scope.selectedDevice);
    $http.get("/dropCollection/?name=" + $scope.selectedDevice)
     .then(function(res){
      if(res.data == "ok"){
        dbService.deleteDevice($scope.selectedDevice);
      }
     });
  }

  $scope.$on('devicesSet',function(){
    $scope.devices = dbService.getDevices();
  })
})
