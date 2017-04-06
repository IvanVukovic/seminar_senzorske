myApp.service('dbService',function($http, $rootScope){
  var devices = [];

  var setDevices = function(devs){
    devices = devs;
  };

  var getDevices = function(){
    return devices;
  }

  var deleteDevice = function(device){
    for(var i = 0; i < devices.length;i++){
      if(devices[i] == device){
        devices.splice(i,1);
      }
    }
  }

  var getDBDevices = function(){
    $http.get("/getDevices/").then(function(res){
      setDevices(res.data.split(",").sort());
      $rootScope.$broadcast('devicesSet');
    });
  }

  return{
    setDevices: setDevices,
    getDevices: getDevices,
    deleteDevice: deleteDevice,
    getDBDevices: getDBDevices
  };
});


myApp.service('graphDataService', function(){
  var data = undefined;
  var live;

  var setValues = function(datar, timestampr){
    if(angular.isDefined(datar) && angular.isDefined(timestampr))
    data = [datar, timestampr];
  }

  var getValues = function(){
    return data;
  }

  var clear = function(){
    data = undefined;
  }
  var isLive = function(){
    return live;
  }

  var setLive = function(liver){
    live = liver;
  }

  return{
    setValues: setValues,
    getValues: getValues,
    clear    : clear,
    isLive   : isLive,
    setLive  : setLive
  };
});
