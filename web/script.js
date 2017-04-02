<<<<<<< HEAD
// script.js

        // also include ngRoute for all our routing needs
    var myApp = angular.module('myApp', ['ngRoute', 'chart.js']);

    // configure our routes
    myApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })

            .when('/pregled', {
              templateUrl : 'pages/pregled.html',
              controller  : 'pregledController'
            });
    });

    // create the controller and inject Angular's $scope
    myApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });

    myApp.controller('pregledController', function($scope, $http, $interval, graphDataService) {
      var promise = undefined;
      $http.get("/getDevices/").then(function(res){
        console.log(res.data);
        $scope.devices = res.data.split(",").sort();
        $scope.selectedDevice = $scope.devices[0];
        $scope.counts = [10, 20, 50, 100, 500];
        console.log($scope.devices);
      })

      $scope.GetData = function(Device, count){
          //tribalo bi nacrtat graf
          $http.get("/getValues/?name=" + Device + "&count=" + count).then(function(response){
            $scope.data = response.data;
            console.log(response.data);
            var values = [];
            var timestamp = [];
            response.data.forEach(function(object){
              values.push(parseFloat(object.value));
              timestamp.push(object.date);
            });
            graphDataService.setValues(values, timestamp);
          });
          //check for new devices in db
          $http.get("/getDevices/").then(function(res){
            $scope.devices = res.data.split(",").sort();
          })
      };

      $scope.Graph = function(device, count){
        if(angular.isDefined(promise)){
          $interval.cancel(promise);
          promise = undefined;
        }
        promise = $interval(function(){$scope.GetData(device, count)}, 2000, false, [device, count]);
        //sad triba nacrtat
      }

    });

    myApp.controller('chartController', function ($scope, $interval, graphDataService) {
      var promise = undefined;
      $scope.series = ['Series A'];
      $scope.colours = ['#1e90ff', '#3498DB', '#717984', '#F1C40F'];
      console.log("chart controller " + graphDataService.getValues()[0]);
      $scope.options = {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            },
            {
              id: 'y-axis-2',
              type: 'linear',
              display: true,
              position: 'right'
            }
          ]
        }
      };
      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };

      $interval(function () {
        $scope.data = [graphDataService.getValues()[0].reverse()]; //data must be in double array for hover to work
        $scope.labels = graphDataService.getValues()[1].reverse();
      }, 3000);
      });


    myApp.service('graphDataService', function(){
      var data = [];

      var setValues = function(datar, timestampr){
        data = [datar, timestampr];
        console.log("Service " + data[0]);
      }

      var getValues = function(){
        return data;
      }

      return{
        setValues: setValues,
        getValues: getValues
      };
    });
=======
// script.js

        // also include ngRoute for all our routing needs
    var myApp = angular.module('myApp', ['ngRoute']);

    // configure our routes
    myApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            })
            .when('/pregled', {
              templateUrl : 'pages/pregled.html',
              controller  : 'pregledController'
            });
    });

    // create the controller and inject Angular's $scope
    myApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });

    myApp.controller('aboutController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });

    myApp.controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    });

    myApp.controller('pregledController', function($scope, $http) {

      $http.get("/getDevices/").then(function(res){
        console.log(res.data);
        $scope.devices = res.data.split(",").sort();
        console.log($scope.devices);
      })

      $scope.GetData = function(query){
          $http.get("/getValues/?name=" + query).then(function(response){
            $scope.message = response.data;
            console.log(response.data);
          });
          $http.get("/getDevices/").then(function(res){
            console.log(res.data);
            $scope.devices = res.data.split(",").sort();
            console.log($scope.devices);
          })
      };

    });
>>>>>>> fe02c0c98016c73a4790bacd10a3176c0ee23f60
