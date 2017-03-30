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
