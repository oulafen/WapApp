function TextStrategyDetailController($scope, $navigate, $http,$routeParams,$timeout){

    $http({
        method:'POST',
        url:'/back_strategy_detail',
        data:{'id':$routeParams.id}
    }).success(function(back){
        $scope.strategy=back['strategy'];
    });

    $scope.go_app_detail=function(){
        $navigate.back();
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