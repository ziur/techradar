techRadarApp.directive('loginDialog', function() {
    return {
      restrict: 'C',
      link: function(scope, elem, attrs) {
        //once Angular is started, remove class:
        elem.removeClass('waiting-for-angular');
        console.log('login handler!!!!');
        
        var login = elem.find('#login-holder');
        scope.$on('event:auth-loginRequired', function() {
        	console.log('on event:event:auth-loginRequired ');
          login.modal('show');
        });
        scope.$on('event:auth-loginConfirmed', function() {
        	console.log('on event:event:auth-loginConfirmed ');
          login.modal('hide');
        });
      }
    }
  });

