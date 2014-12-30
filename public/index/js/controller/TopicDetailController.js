function TopicDetailController($scope, $navigate, $routeParams, $http) {
    (function init() {
        fetch_topic(fetch_relies);
    })();

    function fetch_topic(cb) {
        $http({
            url: "/topics/" + $routeParams.topic_id + ".json",
            method: "GET"
        })
            .success(function (data, status, headers, config) {
                $scope.topic = data.topic;
                cb();
            }).
            error(function (data, status, headers, config) {
            });

    }

    function fetch_relies() {
        $http({
            url: "/replies.json?item_type=Topic&item_id=" + $routeParams.topic_id,
            method: "GET"
        })
            .success(function (data, status, headers, config) {
                $scope.replies = data.replies;
            }).
            error(function (data, status, headers, config) {
            });
    }

    function fetch_users(){
    }

    $scope.sub_reply = function () {
        $scope.has_err = !$scope.reply_body;
        if($scope.has_err ){
           return "";
        }
        $http({
            url: "/reply_to_topic",
            method: "POST",
            data: {
                item_id: $routeParams.topic_id,
                reply_body: $scope.reply_body,
                replier: User.get_user_for_sub_topic(),
                item_type:"Topic"
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

    $scope.parse_date = function (date) {
        var date = new Date(date);
        var str_date = date.getFullYear() +
            "-" + (date.getMonth() + 1) +
            "-" + date.getDate() +
            "-" + date.getHours() +
            ":" + date.getMinutes();
        return str_date;
    };

    $scope.go_back = function(){
        $navigate.back();
    }

    $scope.find_user = function (user_id) {
        var user = _.find($scope.repliers, function (user) {
            return user.id == user_id;
        });
        return user;
    }
}