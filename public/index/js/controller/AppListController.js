function AppListController($scope,$navigate,$routeParams,$http,List){
    $scope.back_to_home = function () {
        $navigate.go('/home');
    };

    var type = {
        game            : '游戏',
        application     : '应用'
    };

    $scope.type       = type[$routeParams.type];
    $scope.app_list = new List('POST', '/apps_list_data', {type: type[$routeParams.type]});

    $http({
        method: 'POST',
        url: '/apps_list_data',
        data: {type: type[$routeParams.type], page: 1}
    }).success(function (respond_data) {
            if(!respond_data['data'][0]){
                $scope.app_list.loading = false;
            }
//        alert(JSON.stringify(respond_data['data']))
            $scope.app_list.listData = respond_data['data']
        });

    $scope.go_app_detail = function (id, video_link) {
        localStorage.setItem("app_id", id);
        localStorage.setItem("video_link", video_link);
        $navigate.go("/app_detail");
    };

    $scope.go_to_page = function(url){
        $navigate.go(url)
    };
}