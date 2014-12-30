function FeedBackController($navigate,$http,$scope){
    $scope.sub_feedback = function () {
        $scope.has_err = !$scope.feedback;
        if($scope.has_err ){
            return "";
        }
        $http({
            url: "/feedbacks",
            method: "POST",
            data: {
                user: User.get_current_user(),
                body: $scope.feedback
            }
        })
            .success(function (data, status, headers, config) {
                if(data.status){
                    alert("我们已经收到您的反馈，谢谢！")
                    return
                }
                alert("网络异常！")
            }).
            error(function (data, status, headers, config) {
                alert("网络异常！")
            });

        $scope.feedback = "";
        $scope.has_err = false;
    }

    $scope.go_back = function(){
        $navigate.back();
    }
}