function ForgetPasswordController($scope, $navigate, $http, $timeout) {
    $scope.show_alert = false;
    $scope.success = false;
    $scope.go_back = function () {
        $navigate.back();
    }
    $scope.send_email = function () {
        $http({
            url: "/users/forget_password.json",
            method: "POST",
            data: {
                email: $scope.mailbox
            }
        })
            .success(function (data) {
                $scope.success = data.succeed;
                $scope.show_alert = true;
                $timeout(function () {
                    $scope.show_alert = false;
                }, 1000);
            })
    }
}