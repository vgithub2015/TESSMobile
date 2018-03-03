angular.module('starter')

.controller('AppCtrl',function(){})

.controller('dashCtrl',function(){})

.controller('mainCtrl',function( $rootScope,$state,$scope,$window , $log , TESSFactory, $ionicHistory ){

		$scope.logout=function(){
		   
		 document.getElementById("Username").value="";
		 document.getElementById("Password").value="";
		 $window.localStorage.clear();
		 $ionicHistory.clearCache();
		 $ionicHistory.clearHistory();
         // $window.localStorage['Scripts'] = "";
         // $window.localStorage['Admin'] = "";
         // $window.localStorage['Logs'] = "";
         // $window.localStorage['Feedback'] = "";
         // $window.localStorage['Stats'] = "";

         // $window.localStorage["authToken"] = "";
         // $window.localStorage["userName"] = "";
         // $window.localStorage["Password"] = "";

		// $rootScope = $rootScope.$new(true);
		// $scope = $scope.$new(true);
	
		TESSFactory.Logoff()
			.then(function successCallback(response){
				if (response.data.result == 'true')
				{
					$state.go('login');
				}
				else
				{
					$state.go('login');
				}
			},function errorCallback(response) {
				$log.info('Error Invoking Logoff Service');
		});;
		$scope.pageFlow = {};
		$state.go('login');
	}

	var ScriptsTab = $window.localStorage['Scripts'] == 'N' ? true : false;
	var AdminTab = $window.localStorage['Admin'] == 'N' ? true : false;
	var LogsTab = $window.localStorage['Logs'] == 'N' ? true : false;
	var StatsTab = $window.localStorage['Stats'] == 'N' ? true : false;
	var FeedbackTab = $window.localStorage['Feedback'] == 'N' ? true : false;
	$scope.pageFlow = {
	   ScriptsTab : ScriptsTab,
	   AdminTab : AdminTab,
	   LogsTab : LogsTab,
	   StatsTab : StatsTab,
	   FeedbackTab : FeedbackTab
	}

console.log($scope.pageFlow.ScriptsTab);
console.log($scope.pageFlow.AdminTab);
console.log($scope.pageFlow.LogsTab);
console.log($scope.pageFlow.StatsTab);
console.log($scope.pageFlow.FeedbackTab);

$scope.openSub = function(name) {
    	$scope.submenu = true;
    		$scope.selection = 'sub';
  	}
  	$scope.backToMain = function() {
    $scope.submenu = false;
    $scope.selection = 'main';
  }
})

.controller('RoleRightsCtrl',function($scope,$state,$http,$ionicPopup,$window){
	var AuthToken =  "AuthToken";
	var AuthTokenValue = $window.localStorage['UserName']+"|"+$window.localStorage['authToken'];
	console.log(AuthTokenValue);
	$scope.RoleRights = {};
   $scope.ProjectList  = {};
   $scope.ProjectRolesList  = {};
	console.log('ProjectList');
	var serviceUrl = "http://usmecbasspc3:9090/TessApp/";
	$http.post(serviceUrl + "retrieveProjects",{AuthToken:AuthTokenValue}).success(function(projects){
		if(projects){
			console.log(projects.listProjects);
			$scope.ProjectList = projects.listProjects;
		}
	});

	$scope.rmOnProjectChange = function() {
		console.log('role rights on projec change');
		console.log($scope.RoleRights);
		if($scope.RoleRights.project){
			var RoleRights = {AuthToken:AuthTokenValue,"ProjectId":$scope.RoleRights.project.projectId};
			console.log('getting role for a project');
			$http.post(serviceUrl+'getProjectRoles',RoleRights).success(function(projectRoles){
				if(projectRoles){
					$scope.ProjectRolesList = projectRoles.listRoles;
				}
			});
		}
		else{
			$scope.ProjectRolesList = null;
		}
	};

	$scope.rrOnRoleChange = function(){
		$scope.screenRights=[];
		console.log('role rights on role change');
		if($scope.RoleRights.Role){
			console.log($scope.RoleRights.Role.roleId)
			var RoleRights = {AuthToken:AuthTokenValue,"RoleId":$scope.RoleRights.Role.roleId};
			console.log('getting scree for a role');
			$http.post(serviceUrl+'getRoleRightsScreens',RoleRights).success(function(screenroleRights){
				if(screenroleRights){
					for(i=0;i<screenroleRights.listScreensSelected.length;i++)
					{
						$scope.screenRights[i] = screenroleRights.listScreensSelected[i];
						if(screenroleRights.listScreensSelected[i].selected == "TRUE"){
							$scope.screenRights[i].selected = true;
						}
						else{
							$scope.screenRights[i].selected = false;
						}
					}
				}
				else{
						$scope.screenRights = null;
				}
			});
		}
		else{
			$scope.screenRights = null;
		}
	};

	$scope.rrOnRoleRightsChange = function(changedItem) {
		console.log('OrrOnRoleRightsChange');
		console.log(changedItem);
		if(changedItem){
			var deleteValue = "";
			if(changedItem.selected){
				deleteValue = "N";
			}
			else{
				deleteValue = "Y";
			}
			$http.post(serviceUrl+'updateRoleRights',{AuthToken:AuthTokenValue,"RoleId":$scope.RoleRights.Role.roleId,"ScreenId":changedItem.screenId,"DelInValue":deleteValue})
				.success(function(rightUpdated){
			});
		}
	};
})


.controller('RolesManagementCtrl',function($scope,$state,$http,$ionicPopup,$window){
	var AuthToken = "AuthToken";
	var AuthTokenValue = $window.localStorage['UserName']+"|"+$window.localStorage['authToken'];
	$scope.RolesManagement = {};
   $scope.ProjectList = {};
   $scope.ActionsList = {};
   $scope.ProjectRolesList = {};
   $scope.usersList = {};
	console.log('ProjectList');
	var serviceUrl = "http://usmecbasspc3:9090/TessApp/";
	$http.post(serviceUrl + 'retrieveProjects',{AuthToken:AuthTokenValue}).success(function(projects){
		if(projects){
			console.log('calling projects');
			$scope.ProjectList = projects.listProjects;
			console.log($scope.ProjectList);
		}
	});

	$http.post(serviceUrl + 'retrieveRights',{AuthToken:AuthTokenValue}).success(function(actions){
		if(actions){
			console.log('list of actions');
			$scope.ActionsList = actions.listRights;
			console.log($scope.ActionsList);
		}
	});


	$scope.rmOnProjectChange = function() {
		console.log('chnage project');
		console.log($scope.RolesManagement);
		if($scope.RolesManagement.project){
			var RolesManagement = {AuthToken:AuthTokenValue,"ProjectId":$scope.RolesManagement.project.projectId};
			console.log('getting role for a project');
			$http.post(serviceUrl+ 'getProjectRoles',RolesManagement).success(function(projectRoles){
				if(projectRoles.listRoles){
					console.log('project roles completed');
					$scope.ProjectRolesList = projectRoles.listRoles;
				}
			});
		}
		else{
			$scope.ProjectRolesList = null;
		}
	};

	$scope.Addrole = function() {
		console.log('Add role');
		console.log($scope.RolesManagement);
		if($scope.RolesManagement.project && $scope.RolesManagement.action ) {
			console.log($scope.RolesManagement.project.projectId);
			var rolename = $scope.RolesManagement.project.projectName + "_"+$scope.RolesManagement.action.rightName
			var roledes = $scope.RolesManagement.project.projectName + " "+$scope.RolesManagement.action.rightName

			var roleExist = false;

			if(null!=rolename && $scope.ProjectRolesList.length>0){
				for (i=0;i<$scope.ProjectRolesList.length;i++){
					if($scope.ProjectRolesList[i].roleName == rolename){
						roleExist = true;
					}
				}
			}

			if(!roleExist){
				var RolesManagement = {AuthToken:AuthTokenValue,"RoleName":rolename,"RoleDesc":roledes,"ProjectId":$scope.RolesManagement.project.projectId};
				console.log('Calling add role');
				$http.post(serviceUrl+ 'addRole',RolesManagement).success(function(response){
					if(response){
						console.log('Calling add role completed');
						$scope.usersList = response;
						var RolesManagement = {AuthToken:AuthTokenValue,"ProjectId":$scope.RolesManagement.project.projectId};
						console.log('getting role for a project again');
						$http.post(serviceUrl+ 'getProjectRoles',RolesManagement).success(function(projectRoles){
							if(projectRoles.listRoles){
								console.log('project roles completed');
								$scope.ProjectRolesList = projectRoles.listRoles;
							}
						});
					}
				});
			}
			else{
				var alertPopup=$ionicPopup.alert({
				title:'Message',
				template:'Role already exists'
			});
			}
		}
		else{
			var alertPopup=$ionicPopup.alert({
				title:'Message',
				template:'Please select Project and Action'
			});
		}
	};

})

.controller('ServiceCtrl',function($scope,$state,$http,$ionicPopup,$window, $base64){
	var AuthToken = "AuthToken";
	var AuthTokenValue = $window.localStorage['UserName']+"|"+$window.localStorage['authToken'];
	var serviceUrl = "http://usmecbasspc3:9090/TessApp/"
	var userRoleInfo = $base64.decode($window.localStorage['userroleInfo']);
	$scope.userRole = {};
	$scope.ActionsList = {};
   $scope.usersList = {};
   $scope.userProjectList = {};
   $scope.ProjectRolesList = {};
console.log(userRoleInfo);
	console.log($scope.userRole.UserName);
	var userRole = {AuthToken:AuthTokenValue,"UserName":$scope.userRole.UserName,"UserId":$window.localStorage['UserName'],"Password":userRoleInfo};
	$http.post(serviceUrl + "searchUser",userRole).success(function(response){
		if(response){
			console.log(response.listDeloittteUsers);
			$scope.usersList = response;
		}
	});

	$scope.shoutLoud = function(newValue, oldValue){
		console.log('on-select method');
		$scope.userRole.UserName = newValue.userName;
		$scope.userRole.UserIdno = newValue.loginUserId;
		console.log("selected" + $scope.userRole.UserIdno);
		if($scope.userRole.UserIdno){
			var userProjectrequest = {AuthToken:AuthTokenValue,"UserId":$scope.userRole.UserIdno};
			$http.post(serviceUrl + "getUserProjects",userProjectrequest).success(function(uProjects){
				if(uProjects){
					console.log(uProjects.listProjects);
					$scope.userProjectList = uProjects.listProjects;
					console.log($scope.userProjectList);
				}
			});
		}
		else{
			$scope.ProjectList = null;
		}

	}

	$scope.reloadUsers = function() {
		console.log('reload start');
		console.log($scope.userRole);
		var names = $scope.userRole.UserName.split(",");
		var name = names[0]
		console.log(name);
		var userRole = {AuthToken:AuthTokenValue,"UserName":name,"UserId":$window.localStorage['UserName'],"Password":userRoleInfo};
			$http.post(serviceUrl + "searchUser",userRole).success(function(response){
				if(response){
					$scope.usersList = response.listDeloittteUsers;
					console.log($scope.usersList);
				}
			});
			console.log(name + " search completed");
		};

	$scope.loadAllProjects = function(){
		console.log('load all projects');
		$http.post(serviceUrl + "retrieveProjects",{AuthToken:AuthTokenValue}).success(function(response1){
		console.log('calling');
		if(response1){
			console.log('call start');
			$scope.userProjectList = response1.listProjects;
			console.log($scope.userProjectList);
		}
	});
	};


	$scope.urOnProjectChange = function() {
		console.log('change on UR project');
		 console.log($scope.userRole.userProjectList);
		if($scope.userRole.userProjectList){
			console.log('getting user roles for a project ' + $scope.userRole.userProjectList.projectId + $scope.userRole.UserIdno);
			$http.post(serviceUrl+'getUserRoles',{AuthToken:AuthTokenValue,"UserId":$scope.userRole.UserIdno,"ProjectId":$scope.userRole.userProjectList.projectId}).success(function(userProRoles){
				if(userProRoles.listRolesSelected){
					console.log(userProRoles.listRolesSelected);
					$scope.ProjectRolesList = userProRoles.listRolesSelected;
				}
			});
			$scope.selectedUserRoles.userRole =  'TRUE';
		}
		else{
			$scope.ProjectRolesList = null;
		}
	};

	$scope.selectedUserRoles = {
    	userRole: 'TRUE'
  	};

// https://codepen.io/ionic/pen/saoBG
	$scope.OnSaveRoleChange = function(item) {
		console.log('Change role for user');
		console.log(item);
		if(item){
			console.log('Came in for a Change role of a user');
			$http.post(serviceUrl + 'addUserRole',{AuthToken:AuthTokenValue,"UserId":$scope.userRole.UserIdno,"ProjectId":item.projectId,"RoleId":item.roleId}).success(function(response){
			});
		}
	};
})



.controller('LoginCtrl',function($scope,$http, $state,$ionicPopup,$log,$window,$base64, TESSFactory ){
		
		$scope.data = {};
		$scope.login=function(){
		$log.info('LoginCtrl : Logging');

		var serviceUrl = "http://usmecbasspc3:9090/TessApp/loginVer";
		var adminBaseurl = "http://usmecbasspc3:9090/TessApp/";
		var data = {"LoginId":$scope.data.username,"Password":$scope.data.password};
		var userroleInfo = $base64.encode($scope.data.password);
		$window.localStorage['userroleInfo'] = userroleInfo;
		$window.localStorage['UserName'] = $scope.data.username;
		$log.info("Loggin Service Post Start");
		$http.post(serviceUrl,data).success(function(response){
			console.log(response);
			if(response){
				$log.info(response);
				$window.localStorage['authToken'] = response.authenticationToken.authToken;
				console.log($window.localStorage['authToken']);
				var userProjectrequest = {"AuthToken":$window.localStorage['UserName']+"|"+$window.localStorage['authToken'],"UserId":$window.localStorage['UserName']};
				$http.post( adminBaseurl+"getUserProjects",userProjectrequest).success(function(uProjects){
					if(uProjects){
						console.log('Inside projects')
						console.log(uProjects.listProjects);
						var uProject = uProjects.listProjects[0];
						$window.localStorage['urlBase'] = uProject.projectUrl
						console.log($window.localStorage['urlBase']);
						var fineGrainRequest = {"AuthToken":$window.localStorage['UserName']+"|"+$window.localStorage['authToken'],"UserId":$window.localStorage['UserName'],"ProjectId":uProject.projectId}
						$http.post(adminBaseurl + "fineGrainSecurity",fineGrainRequest).success(function(mfinegrain){
							if(mfinegrain){
								console.log('after fineGrainSecurity');
								//$scope.mfinegrainList = mfinegrain.listFineGrain;
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
				            $state.go('main.dash');
						});
					}
				});

			}else{
					document.getElementById("Username").value="";
					document.getElementById("Password").value="";
					var alertPopup=$ionicPopup.alert({
					title:'Login',
					template:'Invalid User'
				 });
				document.getElementById("Username").value="";
				document.getElementById("Password").value="";
				$state.go('login');
			}
       	 	console.log($scope.data);
			$scope.data = {
			username : ""
			}	
		}).error(function(response){
			console.log("Error Logging In...HTTP status text :" + response  );
			var alertPopup=$ionicPopup.alert({
				title:'Login',
				template:'Error Logging In'
			});
		});
	}
	console.log($scope.data.username)
	
		
})

.controller('MultipleProjectsCtrl',function($scope, $http, $state, $ionicPopup, $window, TESSFactory){
	var AuthToken =  "AuthToken";
	var AuthTokenValue = $window.localStorage['UserName']+"|"+$window.localStorage['authToken'];
	console.log(AuthTokenValue);
	$scope.mProject = {};
	$scope.mProjectList = {};

	TESSFactory.getUserProjects()
	.then(function successCallback(mProjects){
	if(mProjects){
		console.log(mProjects.data.listProjects);
		$scope.mProjectList = mProjects.data.listProjects;
		console.log($scope.mProjectList);
		}
	},function errorCallback(mProjects) {
			$log.info('Error  in loading project');
	})

	$scope.mprojects = function(){
		console.log('Selected Project');
		var adminBaseurl = "http://usmecbasspc3:9090/TessApp/";
		$window.localStorage['urlBase'] = $scope.mProject.projectUrl
		var fineGrainRequest = {"AuthToken":$window.localStorage['UserName']+"|"+$window.localStorage['authToken'],"UserId":$window.localStorage['UserName'],"ProjectId":$scope.mProject.projectId}
		$http.post(adminBaseurl + "fineGrainSecurity",fineGrainRequest).success(function(mfinegrain){
			if(mfinegrain){
				console.log('after fineGrainSecurity');
				//$scope.mfinegrainList = mfinegrain.listFineGrain;
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
            $state.transitionTo('main.dash',{},{reload: true, inherit: false, notify: true});
		});
	};
})


.controller('FeedbackCtrl',function($scope,$http, $state,$ionicPopup){
		$scope.feedback = {};
		$scope.submitFeedback=function(){
		console.log("entering");
		var serviceUrl = "http://usmecbasspc3:9090/TessApp/feedback";
		var feedback = {"subject":$scope.feedback.subject,"message": $scope.feedback.comments};
		/*console.log($scope.data.subject);*/
		console.log($scope.feedback.subject);
		console.log($scope.feedback.comments);
		$http.post(serviceUrl,feedback).success(function(response){
			if(response){
				var alertPopup=$ionicPopup.alert({
				title:'Message',
				template:'Message submited'
			});
			
			}else{
				var alertPopup=$ionicPopup.alert({
				title:'Message',
				template:'Failed'
			});
			}
			
		  alertPopup.then(function(res) {
					$scope.feedback.subject = "";
					$scope.feedback.comments ="";	
					$scope.feedback.feedbacks=true;
			});

})	
}
$scope.cancelFeedback=function(user){
			$scope.feedback.subject = "";
			$scope.feedback.comments ="";	
			$scope.feedback.feedbacks=true;
		}


})


.controller('LogsCtrl',function($scope,$timeout,$http,$window,$log,$state,TESSFactory){
		$scope.items=[];
		$log.info('Calling getSuitLogs');

		$scope.getSuitLogsLocal = function (){
		TESSFactory.getSuitLogs()
					.then(function successCallback(response){
					if (response.data.status == 'true')
					{
						$log.info(response.data.listSuitRunLog);

							for (i=0;i<response.data.listSuitRunLog.length;i++)
							{
								$scope.items[i] = response.data.listSuitRunLog[i];
							}
					}
					else
					{
						$state.go('login');
					}
				},function errorCallback(response) {
					$log.info('Error getting Suit Logs');
				}).finally(function(){
					$scope.$broadcast('scroll.refreshComplete');
				});
		};

		//Get the Logs on page Load
		$scope.getSuitLogsLocal();
		
		//Refresh Suit Logs
		$scope.doRefresh=function(){
		console.log('refreshing');
			$scope.getSuitLogsLocal();
		};
})

.controller('LogDetailsCtrl',function($scope,$timeout,$http,$stateParams,$window,$log,TESSFactory){
		$scope.items=[];
		TESSFactory.getSuitLogDetails()
		.then(function successCallback(response){
			if (response.data.status == 'true')
			{
					for (i=0;i<response.data.listSuitRunDetailsLog.length;i++)
					{
						$scope.items[i] = response.data.listSuitRunDetailsLog[i];
					}
			}
			else
			{
				$state.go('login');
			}
		},function errorCallback(response) {
			$log.info('Error getting Suit Logs');
		}).finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		})		
})

.controller('ServerCtrl',function($scope,$http,$ionicPopup,$timeout,$ionicLoading,HomeofflineService,$window,$log,$state,TESSFactory){
	
		var data = HomeofflineService.all();
		var showLoading = function() {
   		$ionicLoading.show({
     		 template: '<em class="ion-loading-a" style="font-size:3em;"></em>'
   		 });
   		$timeout(function() {
      		$ionicLoading.hide();
     		 $scope.tabColors = data;
    		}, 2000, false);
  		};
	
		$scope.buttonDisable=false;
		$scope.text='Search';
	 	$scope.show = function() {
		    $ionicLoading.show({
    		  template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    		});
  		};

		//Added service call to get all the available suits
		$scope.items=[];
		$log.info('ServerCtrl : Loading all Suits');		
		
		$scope.retriveAllSuits = function() {			
			TESSFactory.getAllSuites($window.localStorage['urlBase'])
			.then(function successCallback(response){
			 if(response.data.status == 'true' )
			 {
				 $scope.items = response.data.listSuites;					  
				 console.log($scope.items);
				 for (i=0;i<response.data.listSuites.length;i++)
				 {
				  $scope.items[i].name=response.data.listSuites[i].suiteName; 
				  $scope.items[i].description=response.data.listSuites[i].suiteDesc; 
				 }
			}
			else
			{
				$state.go('login');
			}
	 		}),function errorCallback(response) {
				$log.error("Error Retrieving Suits:" + response.statusText  );
				}
		};
		//Load All the suites on page load
		$scope.loadData = function(){ 
			console.log("Re-load");
			$scope.retriveAllSuits();
		};
		$scope.loading=[];
		  for(var i = $scope.items.length - 1; i >= 0; i--) {
		    $scope.loading[i] = false;
		}
		//Pull to Refresh
		$scope.doRefresh = function(){
		$log.info('ServerCtrl : Refreshing all Suits');		
			$scope.retriveAllSuits();
		}; 
		$scope.itemsList=[];
		$scope.loadDataList = function(item,$index,batchName){   		
   		$scope.loading[$index]=true;		
		var tmpVar = 'model_'+item;
		$scope.buttonDisable=true;
		TESSFactory.invokeSuite(batchName)
			.then(function successCallback(response) {
				//$log.info("InvokeSuite Service Status : " + response.data.status);
				if(response.data.status == 'true' )
				{
					//$log.info("Suite invoked successfully for " + batchName);
					$scope.text='In progress';
					$timeout(function(){
						 $scope.loading[$index]=false;
					},30000)
				}
				else
				{
					$state.go('login');
				}
			// this callback will be called asynchronously
			// when the response is available				
			  }, function errorCallback(response) {
				  $log.error("Error Posting...HTTP status text :" + response.statusText  );
				  var alertPopup=$ionicPopup.alert({
						title:'Error',
						template:'Error Invoking, Please try again later!'
					});
				  $scope.loading[$index]=false;
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			  });	  
	};
});