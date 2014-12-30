function AppGiftPackListController($scope,$navigate,$routeParams,$http,List){

    $scope.gift_pack_list = new List('POST', '/back_app_gift_packs', {'app_id': $routeParams.app_id,'mailbox':User.get_current_user().mailbox});

    $http({
        method: 'POST',
        url: '/back_this_app',
        data: {'id': localStorage.getItem("app_id")}
    }).success(function (back) {
            $scope.app = back['data']
        });

    $http({
        method: 'POST',
        url: '/back_app_gift_packs',
        data: {'app_id': $routeParams.app_id,'mailbox':User.get_current_user().mailbox,'page':1}
    }).success(function (back) {
            if(!back['data'][0]){
                $scope.gift_pack_list.loading = false;
            }
            $scope.gift_pack_list.listData = back['data'];
        });

    $scope.go_back = function() {
        $navigate.back()
    };

    $scope.go_gift_pack_detail = function(gift_pack_id){
        $navigate.go('/gift_pack_detail/'+gift_pack_id);
    };

    $http({
        method: 'POST',
        url: '/back_download_info',
        data: {'app_id': localStorage.getItem("app_id")}
    }).success(function(back){
            $scope.apk_status=back['apk_status'];
            $scope.ipa_status=back['ipa_status'];
            $scope.apk_url=back['apk_url'];
            $scope.ipa_url=back['ipa_url'];
        });

    $scope.download_app =function(){
        var browser={
            versions:function(){
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        }
        var user=JSON.parse(localStorage.getItem("user"));
        if(browser.versions.ios){
            var app_type="#ipa_a";
            if($scope.ipa_status=="false"){
                alert("该应用暂时未能下载")
                return
            }
        }else{
            var app_type="#apk_a";
            if($scope.apk_status=="false"){
                alert("该应用暂时未能下载")
                return
            }
        }
        if(user){
            $http({
                method: 'POST',
                url: '/judge_download_status',
                data: {'user_mailbox':user['mailbox'],'app_id':localStorage.getItem("app_id")}
            }).success(function(back){
                if(back['status']=='false'){
                    user['integral']=user['integral']+200;
                    localStorage.setItem("user",JSON.stringify(user))
                    window.location=$(app_type)[0].href;
                }else{
                    window.location=$(app_type)[0].href;
                }
            })
        }else{
            window.location=$(app_type)[0].href;
        }
    }
}