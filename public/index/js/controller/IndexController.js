function IndexController($scope, $navigate, $http, $timeout, slider) {
    function reload_page(){
        if(localStorage.getItem("third_login")){
            localStorage.removeItem("third_login")
            location.reload();
        }
    }
    reload_page();


    function init() {
        if (!User.is_login()) {
            $scope.show_tip = true;
            $timeout(function () {
                $scope.show_tip = false;
            }, 15000);
        }
        calculate_list_css_by_client_width();
        fetch_messages();
        if (User.get_login_info_status()) {
            update_user();
        }
        var user = User.get();
        var user_third_part_login_deal = {
            true: function () {
                if(!user.login){
                    user = JSON.parse(localStorage.getItem("third_party_user"));
                    user.nickname = user.name;
                    user.logo = user.head;
                }
                user.third_part_login = true;
            },
            false: function () {
                user.third_part_login = false;
            }
        }
        if (user) {
            user.login = true;
            user.logo = user.logo == null ? "img/default_logo_user.png" : user.logo;
        }

        if (!user) {
            user = {};
            user.logo = "img/default_logo_user.png"
            user.login = false;
        }
        user_third_part_login_deal[localStorage.third_party_user != undefined]();
        $scope.user = user;
        User.clear_logo();
    };
    init();
    function update_user() {
        $http({
            url: "/users/fetch_info.json?mailbox=" + User.get_current_user().mailbox,
            method: "GET"
        })
            .success(function (data) {
                User.save(data);
                $scope.init_index();
            })
    }

    window.onorientationchange = function () {
        if (window.orientation != 0) {
            alert('为达到更好的浏览效果，请使用竖屏观看！');
        }
    };

    function fetch_messages() {
        $http({
            url: "/messages.json?user=" + User.get_current_user().mailbox,
            method: "GET"
        })
            .success(function (data, status, headers, config) {
                $scope.messages = Message.filter_messages(data.messages);
            })
    }

    $scope.go_messages = function () {
        $navigate.go("/user/messages");
    };


    $scope.go_next = function () {
        var user = User.get();
        if (user) {
            $navigate.go('/user/personal_center')
        }
        if (!user) {
            $navigate.go('/user/new');
        }
    };

    $scope.go_to_page = function (url) {
        $navigate.go(url);
    };

    $http({
        method: 'POST',
        url: '/app_data'
    }).success(function (back) {
            $scope.apps = back['data']
        });

    $scope.go_app_detail = function (id, video_link) {
        localStorage.setItem("app_id", id);
        localStorage.setItem("video_link", video_link);
        $navigate.go("/app_detail");
    };

    $scope.get_app_price = function (price) {
        return price
    };

    $scope.go_video_list = function (type) {
        $navigate.go('/video_list/' + type);
    };

    $scope.go_app_list = function (type) {
        $navigate.go('/app_list/' + type);
    };

    $http({
        method: 'POST',
        url: '/videos_data'
    }).success(function (respond_data) {
            $scope.videos = respond_data['videos']
        });

    $scope.go_video_detail = function (video_id) {
        $navigate.go('/video_detail/' + video_id)
    };

    function calculate_list_css_by_client_width() {
        var bottom = document.body.clientWidth * 20 / 640 + 'px',
            left_right = document.body.clientWidth * 20 / 640 + 'px',
            ad_height = document.body.clientWidth * 7 / 16 + 'px';
        $scope.ad_height = 'height: ' + ad_height;
        $scope.ul_padding = 'padding:' + '0 ' + left_right + ' 0 ' + left_right;
        $scope.li_tag_margin = 'margin:' + ' 0' + ' 0 ' + bottom + ' 0';
    }

    $scope.open_ad_link = function (ad_link) {
        window.open('http://' + ad_link);
    };

    $scope.$on('$viewContentLoaded', function () {
        $(".slidesjs-container").detach();
        $(".slidesjs-pagination ").detach();
        $http({
            method: 'POST',
            url: '/ads_data',
            data: {position: 'home'}
        }).success(function (respond_data) {
                $scope.ads = respond_data['ads'];
                var sliderInterval = window.setInterval(function () {
                    if ($(".slidesjs-container").length != 0) {
                        slider.config(false);
                        window.clearInterval(sliderInterval);
                    }
                    slider.config(false);
                }, 1);
            });
    });
}