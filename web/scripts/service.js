myApp.service('dbService',function($http, $rootScope){
  var devices = [];
  var data = [];

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

  var getValuesFromDB = function(Device, count, time){
    if(time == 0){
      $http.get("/getValues/?name=" + Device + "&count=" + count + "&live=on")
       .then(function(response){
         data = response.data;
         $rootScope.$broadcast('dataReady');
       });
    }else{
      $http.get("/getValues/?name=" + Device + "&count=" + count + "&time=" + time)
       .then(function(response){
          data = response.data;
          $rootScope.$broadcast('dataReady');
        });
    }
  }

  var getValues = function(){
    return data;
  }
  return{
    setDevices: setDevices,
    getDevices: getDevices,
    deleteDevice: deleteDevice,
    getDBDevices: getDBDevices,
    getValuesFromDB: getValuesFromDB,
    getValues: getValues
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
