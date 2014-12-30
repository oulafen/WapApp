function LoginController($scope, $navigate, $timeout, $http, $routeParams) {
    var tencent = null;
    (function init() {
        if ($routeParams.params == "tencent") {
            tencent = JSON.parse(localStorage.tencent);
            var url = "https://open.t.qq.com/api/user/info?format=js&access_token=" + tencent.access_token + "&oauth_consumer_key=801527396&openid=" + tencent.openid + "&oauth_version=2.a";
            $.ajax({url: url, dataType: "jsonp", jsonpCallBack: "person", success: function () {
            }})
                .complete(function () {
                })
        }
    })();
    $scope.init = function () {
        $scope.login_disabled = true;
    };

    $scope.go_improve_user_info = function () {
        $navigate.go('/user/new')
    };

    $scope.go_user_improve_info=function(){
        $navigate.go('/user/new')
    };

    $scope.login = function () {
        localStorage.setItem('current_url', "/login");
        var user = new User('', $scope.password, '', $scope.mailbox, '');
        user.login();
    };

    $scope.go_forget_password = function () {
        $navigate.go("/user/forget_password");
    };

    $scope.go_back = function () {
        $navigate.go("/home")
    };

    $scope.init();
    $scope.fake_twb_login = function () {
        if(localStorage.is_tencent_login == "true"){
            if (confirm("已绑定腾讯微博账号，是否重新绑定?")) {
                localStorage.is_tencent_login = false;
                localStorage.removeItem("third_party_user");
//                localStorage.setItem("have_login_tencent","have_login_tencent");
                window.location.href = "https://open.t.qq.com/cgi-bin/oauth2/authorize?client_id=801527396&response_type=token&redirect_uri=http://wap.handx2.com/index/t_auth.html"
            }
        }
        if(localStorage.is_tencent_login != "true"){
//            localStorage.setItem("have_login_tencent","have_login_tencent");
            window.location.href = "https://open.t.qq.com/cgi-bin/oauth2/authorize?client_id=801527396&response_type=token&redirect_uri=http://wap.handx2.com/index/t_auth.html"
        }
    }
    $scope.fake_sina_login = function () {
        var third_party_user = JSON.parse(localStorage.getItem("third_party_user"));
        if (third_party_user && third_party_user['from'] == '新浪微博') {
            $navigate.go('/user/new');
        } else {
            sina_login();
        }
    };

    function click_sina() {
        sina_interval = setInterval(function () {
            if ($("#wb_connect_btn")) {
                document.getElementById("wb_connect_btn").click();
                clearInterval(sina_interval)
            }
        }, 100);
    }

    function sina_login() {
        WB2.anyWhere(function (W) {
            if (!WB2.checkLogin()) {
//                alert("------not")
                W.widget.connectButton({
                    id: "wb_connect_btn",
                    type: '4,2',
                    callback: {
                        login: function (o) { //登录后的回调函数
                            $http({
                                method: 'POST',
                                url: '/third_party_user',
                                data: {'name': o.screen_name, "from": '新浪微博', 'head': o.profile_image_url, 'third_party_id': o.id}
                            }).success(function (back) {
                                    localStorage.setItem("third_party_user", JSON.stringify(back));
                                    window.location = "http://"+window.location.hostname+"/index/#/home";
                                });
                        },
                        logout: function () { //退出后的回调函数
                        }
                    }
                });
                click_sina();
            } else {
//                alert("----------login")
                if (confirm("已绑定新浪微博账号，是否重新绑定？")) {
                    WB2.logout(function () {
                        W.widget.connectButton({
                            id: "wb_connect_btn",
                            type: '4,2',
                            callback: {
                                login: function (o) { //登录后的回调函数
                                    $http({
                                        method: 'POST',
                                        url: '/third_party_user',
                                        data: {'name': o.screen_name, "from": '新浪微博', 'head': o.profile_image_url, 'third_party_id': o.id}
                                    }).success(function (back) {
                                            localStorage.setItem("third_party_user", JSON.stringify(back));
                                            window.location = "http://"+window.location.hostname+"/index/#/home";
                                        });
                                },
                                logout: function () { //退出后的回调函数
                                }
                            }
                        });
                        click_sina()
                    });
                }
            }
        });
    }
}
