function VideoDetailController($scope, $navigate, $routeParams, $http) {
    (function init(){
        fetch_relies();
    })();
    $scope.share_app=function(){
        $navigate.go("/share_app/"+$routeParams.video_id)
    };
    $scope.back_detail = function(){
        $scope.all_replies_show = false;
        $scope.reply_limit = 3;
    }
    $scope.reply_limit = 3;
    $scope.show_all_replies = function(){
        $scope.all_replies_show = true;
        $scope.reply_limit = $scope.replies.length;
    }
    function fetch_relies() {
        $http({
            url: "/replies.json?item_type=Video&item_id=" + $routeParams.video_id,
            method: "GET"
        })
            .success(function (data) {
                $scope.replies = data.replies;
                $scope.replies.reverse()
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
            url: "/videos/reply",
            method: "POST",
            data: {
                item_id: $routeParams.video_id,
                reply_body: $scope.reply_body,
                replier: User.get_user_for_sub_topic(),
                item_type:"Video"
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

    $scope.go_back = function() {
        if(localStorage.from_search=="true"){
            localStorage.back_to_search = "true"
            localStorage.from_search = "false"
        }
        $navigate.back()
    };

    $http({
        method: 'POST',
        url: '/back_this_video',
        data: {id: $routeParams.video_id}
    }).success(function(respond_data) {
        $scope.video = respond_data['video'];
        $scope.video_imgs = respond_data['video_imgs'];
        load_video(respond_data['video']);
    });

    $scope.youku_height=document.body.clientWidth*0.88*0.56 + 'px';

    function load_video(video) {
        var link = video.video_link
        if (link) {
            var vid = link.substr(7).split('/')[2].split('.')[0].substr(3);
            player = new YKU.Player('youkuplayer', {
                styleid: '0',
                client_id: 'e0f9a72fe9742324',
                vid: vid,
                events:{
                    onPlayerReady: function() {
                        $('.x-video-poster>img').attr('src', video.cover.url);
                    },

                    onPlayStart: function() {
                        $http({
                            method:'post',
                            url: '/add_video_views',
                            data:{id:$routeParams.video_id}
                        })
                    },

                    onPlayEnd: function() {
//                        alert('PlayEnd');
                    }
                }
            });
            function playVideo(){
//                alert('playVideo')
                player.playVideo();
            }
            function pauseVideo(){
//                alert('pauseVideo');
                player.pauseVideo();
            }
        }
    }

    $scope.show_big_image = function(img){
        $scope.big_image_src = img;
        $("#big_img_modal").modal('show');
    };


//    $scope.$on('$viewContentLoaded', load_video());

}