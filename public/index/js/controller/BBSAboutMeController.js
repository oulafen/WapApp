function BBSAboutMeController($scope, $navigate, $http, $routeParams){
    (function init() {
        $scope.title="我的吐槽";
        fetch_topics();
    })();
    function fetch_topics() {
        $http({
            url: "/topics_about_me.json?owner=" + User.get_current_user().mailbox,
            method: "GET"
        })
            .success(function (data, status, headers, config) {
                topics = data.topics;
                $scope.topics = _.sortBy(topics,function(topic){
                    return - new Date(topic.last_replied_at);
                });
                users = data.users;
            }).
            error(function (data, status, headers, config) {
            });
    }

    var users = null;

    $scope.go_back = function () {
        $navigate.back();
    }

    $scope.parse_date = function (topic) {
        if (topic.last_replied_at == null) {
            return "";
        }
        var date = new Date(topic.last_replied_at);
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
        $navigate.go("/topic_detail/" + topic_id);
    }

    $scope.go_next_page = function () {
        $navigate.go("/bbs/" + (parseInt($scope.current_page) + 1))
    }

    $scope.go_pre_page = function () {
        $navigate.go("/bbs/" + (parseInt($scope.current_page) - 1))
    }


}