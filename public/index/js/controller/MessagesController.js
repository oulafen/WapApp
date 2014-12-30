function MessagesController($scope, $http, $navigate) {
    (function init() {
        fetch_messages()
    })();

    $scope.parse_date = function (date) {
        var date = new Date(date);
        var str_date = date.getFullYear() + "-" + (date.getMonth() + 1) +
            "-" + date.getDate() +
            "-" + date.getHours() +
            ":" + date.getMinutes();
        return str_date;
    };

    var detail_deals = {
        Topic: function (msg) {
            $navigate.go("/topic_detail/" + msg.item_id)
        },
        App: function (msg) {
            $http({
                url: '/back_this_app',
                method: "POST",
                data: {
                    id: msg.item_id
                }
            })
                .success(function (data) {
                    localStorage.setItem("app_id", msg.item_id);
                    localStorage.setItem("video_link", data.data.video_link);
                    $navigate.go("/app_detail");
                })
        },
        Video: function (msg) {
            $navigate.go("/video_detail/" + msg.item_id)
        },
        System: function (msg) {
            $navigate.go("/sys_msg_detail/" + msg.id)
        }
    }
    var users = null;

    function fetch_messages() {
        $http({
            url: "/messages.json?user=" + User.get_current_user().mailbox,
            method: "GET"
        })
            .success(function (data, status, headers, config) {
                $scope.messages = Message.filter_messages(data.messages);
            })
    }

    $scope.go_to_msg_detail = function (message) {
        if (message.msg_type != "System") {
            $http({
                url: "/messages/" + message.id + ".json",
                method: "DELETE"
            })
                .success(function () {
                    detail_deals[message.msg_type](message);
                })
                .error(function () {
                    alert("网络异常！")
                })
        }
        else {
            Message.set_sys_msg_read(message)
            detail_deals[message.msg_type](message);
        }


    }
    $scope.go_back = function () {
        $navigate.back();
    }

    $scope.find_user = function (user_id) {
            return _.find(users, function (user) {
            return user.id == user_id;
        });
    }
}