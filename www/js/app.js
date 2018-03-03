// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
//angular.module('starter', ['ionic', 'ionic-modal-select'])
angular.module('starter', ['ionic', 'ionic-modal-select','angular-loading-bar','base64'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
	if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
          title: 'No Internet Connection',
          content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
        })
        .then(function(result) {
          if(!result) {
            ionic.Platform.exitApp();
          }
        });
      }
    }
  });
})

.config(function($ionicConfigProvider){
	$ionicConfigProvider.tabs.position('bottom');
})

 .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    //cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = false;
    //cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loggin In...</div>';
  }])


// .config(['$httpProvider', function($httpProvider) {  
// 	    $httpProvider.interceptors.push('sessionInjector');
// 	}])


.config(function($stateProvider,$urlRouterProvider,USER_ROLES){
	$stateProvider
	.state('login',{
		url:'/login',
		templateUrl:'templates/login.html',
		controller:'LoginCtrl'
	})

		.state('LogDetails',{
		url:'/main/public/LogDetails/:suitRunLogId',
		templateUrl:'templates/LogDetails.html',
		controller:'LogDetailsCtrl'

	})
	

	
	.state('main',{
		url:'/',
		//abstract:true,
		templateUrl:'templates/main.html',
		controller:'mainCtrl'
	})
	.state('main.dash',{
		url:'main/dash',
		cache: false,
		views:{
			'dash-tab':{
				templateUrl:'templates/server.html',
				controller:'ServerCtrl'
				
				
			}
		}
	})
	
	.state('main.public',{
		url:'main/public',
		cache: false,
		views:{
			'public-tab':{
				templateUrl:'templates/logs.html',
				controller:'LogsCtrl'
			}
		}
	})
	
	
	.state('main.feedback',{
		url:'main/feedback',
		views:{
			'feedback-tab':{
				templateUrl:'templates/feedback.html',
				controller:'FeedbackCtrl'
			}
		}
	})
	.state('main.RoleRights',{
		url:'main/RoleRights',
		views:{
			'new-tab':{
				templateUrl:'templates/RoleRights.html',
			}
		}
	})
	.state('main.UserRoles',{
		url:'main/UserRoles',
		views:{
			'new-tab':{
				templateUrl:'templates/UserRoles.html',
			}
		}
	})
	.state('main.UserSearch',{
		url:'main/UserSearch',
		views:{
			'new-tab':{
				templateUrl:'templates/UserSearch.html',
			}
		}
	})
	.state('main.RoleManagement',{
		url:'main/RoleManagement',
		views:{
			'new-tab':{
				templateUrl:'templates/RoleManagement.html',
			}
		}
	})
	.state('main.Projects',{
		url:'main/Projects',
		views:{
			'new-tab':{
				templateUrl:'templates/Projects.html',
			}
		}
	})
	.state('main.admin',{
		url:'main/admin',
		views:{
			'admin-tab':{
				templateUrl:'templates/T3.html',
				
			}
		}
	});
	
	$urlRouterProvider.otherwise('login')
});



