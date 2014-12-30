function ResetPasswordController($scope,$navigate){
    $scope.init = function(){
      $scope.user = User.get();
    };

    $scope.go_personal_center = function(){
        $navigate.go('/user/personal_center');
    };

    $scope.save_reset_password = function(){
        User.reset_password($scope.password,$scope.password_confirmation);
    };

    $scope.init();
}