function BBSController($scope, $navigate, $http, $routeParams) {
    (function init() {
        $scope.title = "吐槽";
        fetch_topics();
    })();

    function fetch_topics() {
        $http({
            url: "/topics.json?page=" + $routeParams.page,
            method: "GET"
        })
            .success(function (data, status, headers, config) {
                $scope.topics = data.topics;
                $scope.total_pages = data.total_page;
                $scope.current_page = data.current_page;
            }).
            error(function (data, status, headers, config) {
            });
    }

    var users = null;
//    $scope.total_pages = 0;
//    $scope.current_page = $routeParams.page;
    $scope.go_home = function () {
        $navigate.go("/home");
    }
    $scope.has_err = false;
    $scope.sub_topic = function () {
        $scope.has_err = !($scope.topic_title && $scope.topic_body);
        if (!$scope.has_err) {
            $http({
                url: "/topics",
                method: "POST",
                data: {
                    topic: {
                        title: $scope.topic_title,
                        body: $scope.topic_body
                    },
                    owner: User.get_user_for_sub_topic()
                }
            })
                .success(function (data, status, headers, config) {
                    if ($routeParams.page == 1) {
                        window.location.reload();
                    }
                    if ($routeParams.page > 1) {
                        $navigate.go("/bbs/1");
                    }
                }).
                error(function (data, status, headers, config) {
                });
        }
    };
    $scope.parse_date = function (_date) {
        if (_date == null){
            return ""
        }
        var date = new Date(_date);
        var str_date = date.getFullYear() + "-" + (date.getMonth() + 1) +
            "-" + date.getDate() +
            "-" + date.getHours() +
            ":" + date.getMinutes();
        return str_date;
    };
    $scope.find_user = function (user_id) {
        if (user_id == undefined) {
            return null;
        }
        var user = _.find(users, function (user) {
            return user.id == user_id;
        });
        return user.nickname;
    }
    $scope.cut_content = function (str) {

        if (str.length > 48) {
            return str.substr(0, 48) + "...";
        }
        return str;
    }
    $scope.go_to_detail = function (topic_id) {
        $http({
            method: 'POST',
            url: '/add_topic_view_num',
            data: {id: topic_id}
        });
        $navigate.go("/topic_detail/" + topic_id);
    }

    $scope.go_next_page = function () {
        $navigate.go("/bbs/" + (parseInt($scope.current_page) + 1))
    }

    $scope.go_pre_page = function () {
        $navigate.go("/bbs/" + (parseInt($scope.current_page) - 1))
    }

    $scope.go_to_page = function (url) {
        $navigate.go(url);
    };

}