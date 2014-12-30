function PersonalCenterController($scope, $navigate, $timeout) {
    (function () {
        var load_logo = User.get_logo();
        if (load_logo) {
            $scope.tourist_logo_src = load_logo;
            $scope.tourist_logo_show = true;
        }
        if (!load_logo) {
            if (localStorage.getItem("third_party_user")) {
                $scope.third_logo_show = true;
            } else {
                $scope.default_logo_show = true;
            }
        }
        if(localStorage.getItem("crop_logo_data")){
            User.update_user_logo();
        }
    })()
    var myInterval = null;

    $scope.go_to_current_download_apps = function () {
        $navigate.go("/current_download_apps");
    };

    $scope.back_to_home = function () {
//        window.location = "http://" + window.location.hostname + "/index/#/home";
        $navigate.go("/home");
    };

    $scope.init = function () {
        $scope.user = User.get();
        $scope.user_logo_show = $scope.user.logo ? true : false;
        $scope.save_confirm = false;
        $scope.nickname_input = $scope.user.nickname;
    };

    $scope.logout = function () {
        User.logout();
        $scope.back_to_home();
    };

    $scope.go_reset_password = function () {
        $navigate.go('/user/reset_password');
    };

    $scope.go_crop_image = function () {
        localStorage.setItem("have_crop_image", "have_crop_image");
        User.save_current_url('/index/#/user/new');
        User.save_regist_temp_data($scope.nickname, $scope.password, $scope.password_confirmation, $('#mailbox').val());
        $("#input_logo").val('');
        $("#input_logo").click();
        var MAX_WIDTH = 640;
        var screen_width = $("#wrapper").width();
        var width = screen_width > MAX_WIDTH ? MAX_WIDTH * 2 : screen_width * 2;
        $("#input_logo").localResizeIMG({
            width: width,
            quality: 0.5,
            success: function (result) {
                localStorage.setItem('logo_data', result.base64);
                window.location.href = '/image_crop/';
            },
            before: function (target, blob, file) {

            }
        });
    };

    $scope.save_nickname = function () {
        $timeout(function () {
            $scope.save_confirm = true;
            $timeout(function () {
                $scope.save_confirm = false;
            }, 2000)
        }, 0);
        User.update_nickname();
    };

    $scope.listen_nickname_change = function () {
        if (!myInterval) {
            myInterval = window.setInterval(function () {
                var nickname = User.get_nicknames();
                nickname.push($scope.nickname_input);

                if (nickname.length > 0 && nickname[nickname.length - 1] == nickname[nickname.length - 2]) {
                    window.clearInterval(myInterval);
                    myInterval = null;
                    $scope.save_nickname();
                    $scope.save_confirm = true;
                    localStorage.removeItem('nickname')
                }
                User.save_nickname(nickname);
            }, 1000);
        }
    };

    $scope.go_to_my_gift_packs = function () {
        $navigate.go('/my_gift_packs')
    };

    $scope.go_to_my_activities = function () {
        $navigate.go('/my_activities')
    };

    $scope.go_to_my_topics = function () {
        $navigate.go("/user/personal_center/topics_about_me")
    };

    $scope.go_integral_rules_page = function () {
        $navigate.go('/integral_rules');
    };

    $scope.init();

    if (User.get_logo()) {
        User.update_user_logo();
    }
}