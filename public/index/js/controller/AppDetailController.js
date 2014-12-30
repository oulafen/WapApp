function AppDetailController($scope, $navigate, $http,$timeout) {
    (function init(){
        fetch_relies()
    })();
    $scope.back_detail = function(){
        $scope.all_replies_show = false;
        $scope.reply_limit = 3;
    }
    $scope.reply_limit = 3;
    $scope.show_all_replies = function(){
        $scope.all_replies_show = true;
        $scope.reply_limit = $scope.replies.length;
    };

    $scope.share_app=function(){
        $navigate.go("/share_app/"+$scope.app['id'])
    };

    $scope.youku_height=document.body.clientWidth*0.88*0.56 + 'px';

    function fetch_relies() {
        $http({
            url: "/replies.json?item_type=App&item_id=" + localStorage.app_id,
            method: "GET"
        })
            .success(function (data, status, headers, config) {
                $scope.replies = data.replies;
                $scope.replies.reverse();
                if(data.users[0] &&data.users[0].logo &&data.users[0].logo!=""){
                    $scope.show_logo=true;
                }
            }).
            error(function (data, status, headers, config) {
            });
    }

    $scope.parse_date = function (date) {
        var date = new Date(date);
        var str_date = date.getFullYear() +
            "-" + (date.getMonth() + 1) +
            "-" + date.getDate() +
            "-" + date.getHours() +
            ":" + date.getMinutes();
        return str_date;
    };


    $scope.find_user = function (user_id) {
        var user = _.find($scope.repliers, function (user) {
            return user.id == user_id;
        });
        return user.nickname;
    }
    $scope.sub_reply = function () {
        $scope.has_err = !$scope.reply_body;
        if($scope.has_err ){
            return "";
        }
        $http({
            url: "/apps/reply",
            method: "POST",
            data: {
                item_id: localStorage.app_id,
                reply_body: $scope.reply_body,
                replier: User.get_user_for_sub_topic(),
                item_type:"App"
            }
        })
            .success(function (data, status, headers, config) {
                fetch_relies();
            }).
            error(function (data, status, headers, config) {
            });

        $scope.reply_body = "";
        $scope.has_err = false;
    }

    $scope.go_home = function () {
        if(localStorage.from_search=="true"){
            localStorage.back_to_search = "true"
            localStorage.from_search = "false"
        }
        localStorage.removeItem("video_link");
        $navigate.back();
    };
    $http({
        method: 'POST',
        url: '/back_this_app',
        data: {'id': localStorage.getItem("app_id")}
    }).success(function (back) {
        $scope.app = back['data']
        load_video(back['data']['video_link'])
    });

    function load_video(video_link) {
        var link = video_link;
        if (link) {
            var vid = link.substr(7).split('/')[2].split('.')[0].substr(3);
            player = new YKU.Player('youkuplayer', {
                styleid: '0',
                client_id: 'e0f9a72fe9742324',
                vid: vid
            });
        }
    }
    stop =setInterval(function(){
        if($(".figcaption").find("span").height()>$(".figcaption").height())
        {
            $("#look_all_btn").show();
            clearInterval(stop)
        }
    },100);
    $http({
        method: 'POST',
        url: '/get_app_photo',
        data: {'id': localStorage.getItem("app_id")}
    }).success(function(back){
        $scope.app_photo_urls=back['data']
    });

    $http({
        method: 'POST',
        url: '/back_app_gift_pack_status',
        data: {'app_id': localStorage.getItem("app_id")}
    }).success(function (back) {
            if(back['status']==1){
                $scope.gift_pack_btn_show = true;
            }
        });

    $http({
        method: 'POST',
        url: '/back_app_activity_status',
        data: {'app_id': localStorage.getItem("app_id")}
    }).success(function (back) {
            if(back['status']==1){
                $scope.activity_btn_show = true;
            }
        });

    $scope.app_block_status="introduce";

    $scope.show_strategy=function(){
        $scope.app_block_status="strategy";
        $("#strategy_li").addClass('active');
        $("#introduce_li").removeClass("active");
    };

    $scope.show_introduce=function(){
        load_video($scope.app['video_link'])
        $scope.app_block_status="introduce";
        $("#strategy_li").removeClass('active');
        $("#introduce_li").addClass("active");
    };

    $http({
        method: 'POST',
        url: '/back_strategy_info',
        data: {'app_id': localStorage.getItem("app_id")}
    }).success(function(back){
        if (back["text_strategy"].length==0 && back["video_strategy"].length==0){
            $scope.strategy_status='false';
        }else{
            $scope.strategy_status='true';
        }
        if(back["text_strategy"].length!=0){
            $scope.have_text_strategy=true;
            $scope.text_strategies=back['text_strategy']
        }
        if(back["video_strategy"].length!=0){
            $scope.have_video_strategy=true;
            $scope.video_strategies=back["video_strategy"];
        }
    });

    $scope.go_video_strategy_detail=function(id){
        $http({
            method: 'POST',
            url: '/add_strategy_view_num',
            data:{'id':id}
        });
        $navigate.go('/video_strategy_detail/'+id)
    };

    $scope.go_text_strategy_detail=function(id){
        $http({
            method: 'POST',
            url: '/add_strategy_view_num',
            data:{'id':id}
        });
        $navigate.go('/text_strategy_detail/'+id)
    };

    $scope.show_all=function(){
        $("#all_text").removeClass("hidden");
        $("#part_text").addClass("hidden");
    };

    $scope.show_part=function(){
        $("#part_text").removeClass("hidden");
        $("#all_text").addClass("hidden");
    };

    $scope.go_gift_pack_list = function(app_id,app_name){
        $navigate.go('/app_gift_packs/'+app_id+'/'+app_name)
    };

    $scope.go_activity_list = function(app_id,app_name){
        $navigate.go('/app_activities/'+app_id+'/'+app_name)
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