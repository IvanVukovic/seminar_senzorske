// script.js

        // also include ngRoute for all our routing needs
    var myApp = angular.module('myApp', ['ngRoute', 'chart.js', 'angularjs-datetime-picker']);

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
    myApp.controller('mainController', function($scope, dbService) {
      dbService.getDBDevices();
      // create a message to display in our view
      $scope.message = 'Everyone come and see how good I look!';
    });

    myApp.controller('chartController', function ($scope, $interval, graphDataService) {
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

      var setScopeData = function(){
        if(angular.isDefined(graphDataService.getValues())){
          if(graphDataService.isLive()){
            $scope.data = [graphDataService.getValues()[0].reverse()]; //data must be in double array for hover to work
            $scope.labels = graphDataService.getValues()[1].reverse();
          }
        }
      }

      $scope.$on('$destroy', function(){
        graphDataService.clear();
      });
      $scope.$on('graphData',function(){
        setScopeData();
      })
    });
