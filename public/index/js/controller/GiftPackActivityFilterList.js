function GiftPackActivityFilterList($scope, $navigate, $http, $routeParams) {
    $scope.go_back = function () {
        $navigate.back();
    };

    var filter = {
        has_fetched: {
            head: '已领取礼包',
            type: '礼包',
            post_url: '/back_has_fetched_gift_pack'
        },
        no_fetched: {
            head: '未领取礼包',
            type: '礼包',
            post_url: '/back_no_fetched_gift_pack'
        },
        fetched_over: {
            head: '已领完礼包',
            type: '礼包',
            post_url: '/back_fetched_over_gift_pack'
        },
        no_joined: {
            head: '未参加活动',
            type: '活动',
            post_url: '/back_no_joined_activity'
        },

        has_joined: {
            head: '已参加活动',
            type: '活动',
            post_url: '/back_has_joined_activity'
        },
        overdue: {
            head: '已过期活动',
            type: '活动',
            post_url: '/back_overdue_activity'
        }
    };

    $scope.filter = filter[$routeParams.filter];

    $http({
        method: 'POST',
        url: $scope.filter.post_url,
        data: {mailbox: User.get_current_user().mailbox,filter:$routeParams.filter}
    }).success(function (respond_data) {
            $scope.gift_pack_activity_list = respond_data['data']
        });

    $scope.go_detail = function(index){
        var gift_pack_activity = $scope.gift_pack_activity_list[index];
        localStorage.setItem("app_id",gift_pack_activity.app_id);

        if($scope.filter.type=='礼包'){
            $navigate.go('/gift_pack_detail/'+gift_pack_activity.id)
        }
        if($scope.filter.type=='活动'){
            $navigate.go('/activity_detail/'+gift_pack_activity.id)
        }
    };

}