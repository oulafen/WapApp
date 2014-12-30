function ShareAppController($scope, $navigate, $http,$routeParams){

//    $http({
//        method: 'POST',
//        url: '/back_this_app',
//        data:{'id':$routeParams.id}
//    }).success(function (back) {
//        if(back['data']['apk_link']){
//            var apk_download='安卓下载地址：'+back['data']['apk_link'];
//        }else{
//            var apk_download=""
//        }
//        if(back['data']['iphone_link']){
//            var iphone_download='苹果下载地址：'+back['data']['iphone_link'];
//        }else{
//            var iphone_download=""
//        }
//        $scope.share_text="我在 @指头邦 发现了一款超好玩的游戏哦 你也来试试"+back['data']['name']+apk_download+iphone_download;
//    });
    $scope.share_text="@指头邦 手机游戏热门活动、发卡发号、美女视频、新游戏预告独家测评应有尽有、你也来看看吧。官方网站：http://wap.handx2.com 指头邦Appstore下载地址：https://itunes.apple.com/cn/app/zhi-tou-bang/id886104928?mt=8";
    $scope.go_app_detail=function(){
        $navigate.back();
    };

    $scope.share_to_sina=function(){
        WB2.anyWhere(function(W){
            W.widget.publish({
                'id' : 'wb_publish',
                'default_text' : $('#share_content').html(),
                'callback' : function(o) {
                    window.location='/index/#/app_detail'
                }
            });
        });
    };

    $scope.share_to_tencent=function() {
        var _t = encodeURI($('#share_content').html());
        var _url = encodeURIComponent(document.location);
        var _appkey = "801192940";
        var _pic = encodeURI('');//
        var _site = '';//你的网站地址，可以留空
        var _u = 'http://v.t.qq.com/share/share.php?url='+_url+'&appkey='+_appkey+'&site='+_site+'&pic='+_pic+'&title='+_t;
        window.open( _u,'', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no' );
    }


}