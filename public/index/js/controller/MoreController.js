function MoreController($scope, $navigate, $timeout) {
    $scope.back_to_home = function () {
        $navigate.go("/home");
    };
    (function init () {
        var user=User.get();
        $scope.user = user;
        if(user &&user.logo){
            $scope.user_logo=user.logo;
        }else{
            $scope.user_logo='img/default_logo_user.png';
        }
    })();

    $scope.logout = function () {
        User.logout();
        $scope.back_to_home();
    };

    $scope.go_feedback = function () {
        $navigate.go("/feedback")
    };

    $scope.go_share=function(){
        $navigate.go("/share");
    };

    $scope.clear_cache = function () {
        $scope.cleaning = true;
        for (var item in localStorage) {
            localStorage.removeItem(item)
        }
        $scope.cleaning = false;
        $scope.finished_clean = true;
        $timeout(function () {
            $scope.finished_clean = false;
        }, 500);
    };

    $scope.go_to_page = function (url) {
        $navigate.go(url);
    };
}