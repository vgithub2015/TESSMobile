angular.module('starter')

/*.factory('loginAuth',function($http,$rootScope, $stateParams) {
	return {
		test1:function(){
			return  "Hello WOrld" 
		},
		testRest:function(){
			return $http.get('http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=demo', {
				params:{geonames:$rootScope.session}
			})
		}
		
	};
});*/

.factory ('LogList',function($http,$scope){
	$scope.items=[];
	function logMasterList(){
	var serviceUrl = "http://10.9.189.104:8080/DeloitteTess/scriptLoca";
			$http.get(serviceUrl).success(function(response){
				console.log(response);
				if(null!=response && response.length>0){
				for (i=0;i<response.length;i++){
				$scope.items[i]=response[i];
				console.log($scope.logs);
				}
				}

		})
		}

			return {
				MasterList:logMasterList,
				find:function(id){
					console.log(id);
					var serviceUrl = "http://10.9.189.104:8080/DeloitteTess/scriptLocaPost";
					//var scriptLog= {"scriptLogId"=items.suitRunLogId}
					http.post(serviceUrl,id).success(function(response){

					console.log(id);
					if(null!=response && response.length>0){
					for (i=0;i<response.length;i++){
					$scope.items[i]=response[i];
					console.log($scope.logs);
				}
				}

				})
			}

	
	}
	

})


.factory('HomeofflineService', function() {

			   var data = {
							"tabColors": {
								"applicationTabColor": "green",
								"serverTabColor": "red",
								"serviceTabColor": "yellow",
								"batchTabColor": "green"
							}
						};



				return {
					all: function() {
						return data.tabColors;
					}
				};
})


.factory('TESSFactory',function($http,$window,$stateParams){
	var adminBaseurl = 'http://usmecbasspc3:9090/TessApp/'
	var TESSDataFactory = {};
	var urlBase = $window.localStorage['urlBase'];
	var data = { 'AuthToken' : $window.localStorage['UserName'] + "|" + $window.localStorage['authToken']}

	var AuthToken =  "AuthToken";
	var AuthTokenValue = $window.localStorage['UserName']+"|"+$window.localStorage['authToken'];

	var config = {headers: {'Content-Type': 'application/json'}}

	//LogOff Service
	TESSDataFactory.Logoff = function(){
		var urlBase = $window.localStorage['urlBase'];
		var data = { 'AuthToken' : $window.localStorage['UserName'] + "|" + $window.localStorage['authToken']}		
	   return $http.post(urlBase + '/logOff',data,config);
	};

	//Get Suit Logs Service
	TESSDataFactory.getSuitLogs = function(){
		var urlBase = $window.localStorage['urlBase'];
		var data = { 'AuthToken' : $window.localStorage['UserName'] + "|" + $window.localStorage['authToken']}		
	   return $http.post(urlBase + '/getSuitLogs',data,config);
	};

	//Get Suit Logs Details
	TESSDataFactory.getSuitLogDetails = function(){
		var urlBase = $window.localStorage['urlBase'];
		var data = { 'AuthToken' : $window.localStorage['UserName'] + "|" + $window.localStorage['authToken']}		
	   data ["suitRunLogId"] = $stateParams.suitRunLogId;
	   return $http.post(urlBase + '/getSuitLogDetails',data,config);
	};

	//Get All Suits 
	TESSDataFactory.getAllSuites = function(url){
		//var urlBase = $window.localStorage['urlBase'];
		console.log(url);
		var data = { 'AuthToken' : $window.localStorage['UserName'] + "|" + $window.localStorage['authToken']}
		var config = {headers: {'Content-Type': 'application/json'}}
	   return $http.post(url + '/retrieveAllSuites',data,config);
	};

	//Invoke Suits 
	TESSDataFactory.invokeSuite = function(batchName){
		var urlBase = $window.localStorage['urlBase'];
		var data = { 'AuthToken' : $window.localStorage['UserName'] + "|" + $window.localStorage['authToken']}		
	   data["userName"] = $window.localStorage['UserName'];
	   data["suiteName"] = batchName;
	   return $http.post(urlBase + '/invokesuite',data,config);
	};

	//Set Finegrain Security
	TESSDataFactory.setFinegrainSecurity = function(projectId){
		var AuthToken =  "AuthToken";
		var AuthTokenValue = $window.localStorage['UserName']+"|"+$window.localStorage['authToken'];
		console.log(projectId);
		var fineGrainRequest = {AuthToken:AuthTokenValue,"UserId":$window.localStorage['UserName'],"ProjectId":projectId}
		$http.post(adminBaseurl + "fineGrainSecurity",fineGrainRequest).success(function(mfinegrain){
			if(mfinegrain){
				console.log('after fineGrainSecurity');
				//$scope.mfinegrainList = mfinegrain.listFineGrain;
				console.log(AuthTokenValue);

				for(i=0;i<mfinegrain.listFineGrain.length;i++){
	               	switch(mfinegrain.listFineGrain[i].screenName){
	                  case 'Scripts':
	                     $window.localStorage['Scripts'] = mfinegrain.listFineGrain[i].access;
	                     break;
	                  case 'Admin':
	                     $window.localStorage['Admin'] = mfinegrain.listFineGrain[i].access;
	                     break;	
	                  case 'Logs':
	                     $window.localStorage['Logs'] = mfinegrain.listFineGrain[i].access;
	                     break;
	                  case 'Stats':
	                     $window.localStorage['Stats'] = mfinegrain.listFineGrain[i].access;
	                     break;
	                  case 'Feedback':
	                     $window.localStorage['Feedback'] = mfinegrain.listFineGrain[i].access;
	                     break;
	               }
				}
            }
            console.log('loaded fineGrainSecurity');
            console.log($window.localStorage['Stats']);
		});
	};

	//Get user projects 
	TESSDataFactory.getUserProjects = function(){
		var AuthToken =  "AuthToken";
		var AuthTokenValue = $window.localStorage['UserName']+"|"+$window.localStorage['authToken'];
		console.log('getUserProjects');
		var userProjects = {AuthToken:AuthTokenValue,"UserId":$window.localStorage['UserName']};
		console.log(userProjects);
		return $http.post(adminBaseurl + "getUserProjects",userProjects);
	};

	//Return function from factory
	return TESSDataFactory;
})

// .factory('sessionInjector',  function($window) {  
//     var sessionInjector = {
//         request: function(config) {
//                 config.headers.authorization =  $window.localStorage['UserName'] + "|" + $window.localStorage['authToken'];
//             return config;
//         }
//     };
//     return sessionInjector;
// });