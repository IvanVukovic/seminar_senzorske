angular.module("myApp").controller("myController", function($scope, $http, $interval) {
	var poller = function() {
		$http.get("getdata").then(function(response){
	  		$scope.mydata = response.data;	  		
	  	});					
	};
	$interval(poller, 1000);
	poller();
});