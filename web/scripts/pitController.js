myApp.controller('pitController',function($scope, $http, dbService){
  $scope.devices = dbService.getDevices();

  $scope.dropDevice = function(){
    console.log("brisem " + $scope.selectedDevice);
    $http.get("/dropCollection/?name=" + $scope.selectedDevice).then(function(res){
      if(res.data == "ok"){
        dbService.deleteDevice($scope.selectedDevice);
      }
    });
  }
})
