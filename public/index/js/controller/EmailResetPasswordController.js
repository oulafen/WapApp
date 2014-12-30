function EmailResetPasswordController($scope, $http, $navigate, $routeParams) {
    (function init() {
        $http({
            url: "/users/get_user_by_code.json",
            method: "POST",
            data: {
                code: $routeParams.code
            }
        })
            .success(function (data) {
                if (data.user == null) {
                    $navigate.go("/");
                    return
                }
                $scope.user = data.user
            })
    })();

    $scope.go_personal_center = function () {
        $navigate.go('/home');
    };

    $scope.save_reset_password = function () {
        if (User.judge_reset_password_input($scope.password, $scope.password_confirmation)) {
            $scope.user.password = $scope.password;
            $http({
                url: "/users/reset_password",
                method: "POST",
                data: {
                    user: $scope.user
                }
            })
                .success(function (data) {
                    if(data.status == 1){
                        delete $scope.user.password
                        User.save($scope.user);
                        $navigate.go("/home");
                    }
                    else{
                        alert("网络错误")
                    }
                })
        }

    };

}