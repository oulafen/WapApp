function GiftPackDetailController($scope, $navigate,$routeParams, $http, $timeout) {
    (function init(){
        fetch_relies()
    })();
    $scope.share_app=function(){
        $navigate.go("/share_app/"+$routeParams.gift_pack_id)
    };
    function fetch_relies() {
        $http({
            url: "/replies.json?item_type=App&item_id=" + localStorage.app_id,
            method: "GET"
        })
            .success(function (data, status, headers, config) {
                $scope.replies = data.replies;
                $scope.repliers = data.users;
                if(data.users[0] &&data.users[0].logo &&data.users[0].logo!=""){
                    $scope.show_logo=true;
                }
            }).
            error(function (data, status, headers, config) {
            });
    }

    $http({
        method: 'POST',
        url: '/back_this_app',
        data: {'id': localStorage.getItem("app_id")}
    }).success(function (back) {
            $scope.app = back['data']
        });

    $scope.back_one_gift_pack = function(){
        $http({
            method: 'POST',
            url: '/back_one_gift_pack',
            data: {'id': $routeParams.gift_pack_id,'mailbox':User.get_current_user().mailbox}
        }).success(function (back) {
                $scope.gift_pack = back['data']
            });
    };

    $scope.user_fetch_gift_pack = function(){

        if(!User.is_login()){
            $('#regist-login-modal').modal('show');
            return;
        }
        if($scope.gift_pack.deduct_integral > User.get_current_user().integral){
            $timeout(function(){
                $scope.integral_lack_confirm = true;
                $timeout(function(){
                    $scope.integral_lack_confirm = false;
                },1000)
            },0);
            return;
        }
        $scope.gift_pack_card_nums = GiftPack.get_one_card_num($scope.gift_pack.card_nums);
        if($scope.gift_pack.deduct_integral>0){
            $timeout(function(){
                $scope.deduct_integral_confirm = true;
                $timeout(function(){
                    $scope.deduct_integral_confirm = false;
                },1000)
            },0)
        }
        $http({
            method: 'POST',
            url: '/user_fetch_gift_pack',
            data: {'card_num':$scope.gift_pack_card_nums.card_num,'current_card_nums':$scope.gift_pack_card_nums.card_nums_string,
                'app_id':$scope.app.id, 'gift_pack_id': $routeParams.gift_pack_id,'mailbox':User.get_current_user().mailbox}
        }).success(function (back) {
                if(back.status == 1){
                    $timeout(function(){
                        $scope.back_one_gift_pack();
                        $scope.fetch_success_confirm = true;
                        User.save(back.user);
                        $timeout(function(){
                            $scope.fetch_success_confirm = false;
                        },1000)
                    },1000);
                }
                $scope.card_num = $scope.gift_pack_card_nums.card_num;
                $timeout(function(){
                    $('#copy-modal').modal('show');
                },1500)
            });

    };

    $scope.close_modal = function(){
        $('#regist-login-modal').modal('hide');
    };

    $scope.login = function(){
        var user = new User('',$scope.password,'',$scope.mailbox,'');
        user.login();
        $timeout(function(){
            var is_login_success = User.get_login_info_status();
            if(is_login_success){
                $scope.close_modal();
                $scope.back_one_gift_pack();
            }
        },2000)
    };

    $scope.go_to_user_improve_info = function(){
        $('#regist-login-modal').modal('hide');
        $navigate.go('/user/new')
    };

    $scope.go_back = function() {
        $navigate.back();
    };

    $scope.go_forget_password = function(){
        $scope.close_modal();
        $navigate.go("/user/forget_password");
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

    $scope.back_one_gift_pack();
    var left_right = document.body.clientWidth * 20 / 640  + 'px';
    $scope.page_padding    = 'padding:' + '0' + left_right + ' 0' + left_right;
}