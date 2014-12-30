function MyActivitiesController($scope,$navigate,$http){
    $scope.go_back = function () {
        $navigate.back()
    };

    $http({
        method: 'POST',
        url: '/back_my_activities',
        data: {'mailbox':User.get_current_user().mailbox }
    }).success(function (back) {
            $scope.my_activities = back['data']
        });

    $scope.go_activity_detail = function(app_id,activity_id){
        localStorage.setItem('app_id',app_id);
        $navigate.go('/activity_detail/'+activity_id);
    };

}