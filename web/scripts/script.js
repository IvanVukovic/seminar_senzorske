// script.js

        // also include ngRoute for all our routing needs
    var myApp = angular.module('myApp', ['ngRoute', 'chart.js']);

    // configure our routes
    myApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : '/pages/home.html',
                controller  : 'mainController'
            })

            .when('/pregled', {
              templateUrl : '/pages/pregled.html',
              controller  : 'pregledController'
            })

            .when('/pit', {
              templateUrl: '/pages/pit.html',
              controller : 'pitController'
            });
    });

    // create the controller and inject Angular's $scope
    myApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });

    myApp.controller('pregledController', function($scope, $http, $interval, graphDataService, dbService) {
      var promise = undefined;
      $http.get("/getDevices/").then(function(res){
        dbService.setDevices(res.data.split(",").sort());
        $scope.devices = dbService.getDevices();
        $scope.selectedDevice = $scope.devices[0];
        $scope.counts = [5, 10, 20, 50, 100];
      })

      $scope.GetData = function(Device, count){
          //tribalo bi nacrtat graf
          $http.get("/getValues/?name=" + Device + "&count=" + count).then(function(response){
            $scope.data = response.data;
            if(response.data.length > 0){
              $scope.info = undefined;
              var values = [];
              var timestamp = [];
              response.data.forEach(function(object){
                values.push(parseFloat(object.value));
                timestamp.push(object.date);
              });
              graphDataService.setValues(values, timestamp);
            }
            else{
              $scope.info = 'Nema podataka, provjeri upite!';
            }
          });
          //check for new devices in db
          $http.get("/getDevices/").then(function(res){
            dbService.setDevices(res.data.split(",").sort());
            $scope.devices = dbService.getDevices();
          })
      };

      $scope.Graph = function(device, count){
        stopInterval();
        promise = $interval(function(){$scope.GetData(device, count)}, 2000, false, [device, count]);
        //sad triba nacrtat
      }

      var stopInterval = function(){
        if(angular.isDefined(promise)){
          $interval.cancel(promise);
          promise = undefined;
        }
      }

      $scope.$on('$destroy', function(){stopInterval();});

    });

    myApp.controller('chartController', function ($scope, $interval, graphDataService) {
      var promise = undefined;
      $scope.series = ['Series A'];
      $scope.colours = ['#1e90ff', '#3498DB', '#717984', '#F1C40F'];
      $scope.options = {
        animation: false,
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            }
          ]
        }
      };

      promise = $interval(function () {
        if(angular.isDefined(graphDataService.getValues())){
          $scope.data = [graphDataService.getValues()[0].reverse()]; //data must be in double array for hover to work
          $scope.labels = graphDataService.getValues()[1].reverse();
        }
      }, 3000);

      var stopInterval = function(){
        if(angular.isDefined(promise)){
          $interval.cancel(promise);
          promise = undefined;
        }
      }
      $scope.$on('$destroy', function(){
        stopInterval();
        graphDataService.clear();
      });
    });
