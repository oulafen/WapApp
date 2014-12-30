function VideoListController($scope, $navigate, $http, $routeParams, List) {


    $scope.back_to_home = function () {
        $navigate.go("/home");
    };

    var type = {
        belle: '美女视频',
        hot: '热播视频',
        raiders: '视频攻略'
    };

    $scope.type = type[$routeParams.type];
    $scope.video_list = new List('POST', '/videos_list_data', {type: type[$routeParams.type]});

    $http({
        method: 'POST',
        url: '/videos_list_data',
        data: {type: type[$routeParams.type], page: 1}
    }).success(function (respond_data) {
            if (!respond_data['data'][0]) {
                $scope.video_list.loading = false;
            }
            $scope.video_list.listData = respond_data['data']
        });

    $scope.go_video_detail = function (video_id) {
        $navigate.go('/video_detail/' + video_id);
    };
    $scope.go_to_page = function (url) {
        $navigate.go(url);
    };

    $scope.is_active = $scope.type == '美女视频' ? 'active' : '';

}