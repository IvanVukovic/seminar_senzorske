myApp.service('dbService',function(){
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

  return{
    setDevices: setDevices,
    getDevices: getDevices,
    deleteDevice: deleteDevice
  };
});


myApp.service('graphDataService', function(){
  var data = undefined;

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

  return{
    setValues: setValues,
    getValues: getValues,
    clear    : clear
  };
});
