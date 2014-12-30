function AllGiftPacksController($scope, $navigate, $http, List, $timeout, slider){
    $scope.all_gift_pack_activity_list = new List('POST', '/back_all_gift_packs_activities', {'mailbox':User.get_current_user().mailbox});

    $http({
        method: 'POST',
        url: '/back_all_gift_packs_activities',
        data: {'mailbox':User.get_current_user().mailbox,'page':1}
    }).success(function (back) {
            if(!back['data'][0]){
                $scope.all_gift_pack_activity_list.loading = false;
            }
            $scope.all_gift_pack_activity_list.listData = back['data'];
        });

    $scope.go_home = function(){
        $navigate.go('/home');
    };

    $scope.go_detail = function(index){
        var gift_pack_activity = $scope.all_gift_pack_activity_list.listData[index];
        localStorage.setItem("app_id",gift_pack_activity.app_id);

        if(gift_pack_activity.applicable_time){
            $navigate.go('/gift_pack_detail/'+gift_pack_activity.id)
        }
        if(gift_pack_activity.activity_time){
            $navigate.go('/activity_detail/'+gift_pack_activity.id)
        }
    };

    $scope.go_to_page = function(url){
        $navigate.go(url);
    };

    $scope.go_sort_gift_pack_activity = function(type){
        $navigate.go('/all_gift_packs/'+type);
    }
    $scope.open_ad_link = function (ad_link) {
        window.open('http://' + ad_link);
    };


    var ad_height = document.body.clientWidth * 7 / 16 + 'px';
    $scope.ad_height = 'height: ' + ad_height;
    $scope.$on('$viewContentLoaded', function () {
        $(".slidesjs-container").detach();
        $(".slidesjs-pagination ").detach();
        $http({
            method: 'POST',
            url: '/ads_data',
            data: {position: 'gift'}
        }).success(function (respond_data) {
            $scope.ads = respond_data['ads'];

            var sliderInterval = window.setInterval(function () {

                if ($(".slidesjs-container").length != 0) {
                    slider.config(true);
                    window.clearInterval(sliderInterval);
                }
                slider.config(true);
            }, 1);
        });
    });

}