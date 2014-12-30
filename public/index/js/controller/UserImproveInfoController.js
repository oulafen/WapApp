function UserImproveInfoController($scope,$navigate){

    $scope.init = function(){
        User.clear_current_url();
        var regist_temp_data = User.get_regist_temp_data();
        if(regist_temp_data){
            $scope.nickname = regist_temp_data.nickname;
            $scope.password = regist_temp_data.password;
            $scope.password_confirmation = regist_temp_data.password_confirmation;
            $scope.mailbox = regist_temp_data.mailbox;
            User.clear_regist_temp_data();
        }
        $scope.set_logo_show();
    };

    $scope.set_logo_show = function(){
        var load_logo = User.get_logo();
        if(load_logo){
            $scope.tourist_logo_src = load_logo;
            $scope.tourist_logo_show = true;
        }
        if(!load_logo){
            if(localStorage.getItem("third_party_user")){
                $scope.third_logo_show=true;
            }else{
                $scope.default_logo_show = true;
            }
        }
    };

    function show_third_user(){
        var third_user=JSON.parse(localStorage.getItem("third_party_user"));
        if (third_user){
            $scope.third_party_user_head=third_user['head']
            $scope.nickname=third_user['name'];
        }
    }
    show_third_user();

    $scope.go_back = function(){
        if(localStorage.getItem("have_crop_image")){
            localStorage.removeItem("have_crop_image");
        }
        $navigate.go("/home")
//        location.href = "http://"+window.location.hostname+"/index/#/home"
    };

    $scope.post_user_data = function(){
        var nickname = $scope.nickname,
            password = $scope.password,
            password_confirmation = $scope.password_confirmation,
            mailbox = $scope.mailbox;
        var user = new User(nickname,password,password_confirmation,mailbox);
        user.create();
    };

    $scope.go_crop_image = function() {
        localStorage.setItem("have_crop_image","have_crop_image");
        User.save_current_url('/index/#/user/new');
        User.save_regist_temp_data($scope.nickname,$scope.password,$scope.password_confirmation,$('#mailbox').val());
        $("#input_logo").val('');
        $("#input_logo").click();
        var MAX_WIDTH = 640;
        var screen_width = $("#wrapper").width();
        var width = screen_width > MAX_WIDTH ? MAX_WIDTH*2 : screen_width*2;
        $("#input_logo").localResizeIMG({
            width: width,
            quality: 0.5,
            success: function (result) {
                localStorage.setItem('logo_data',result.base64);
                window.location.href = '/image_crop/';
            },
            before:function (target,blob,file) {

            }
        });
    };

    $scope.go_login = function() {
        $navigate.go('/login/')
    };

    $scope.go_integral_rules_page = function(){
      $navigate.go('/integral_rules');
    };

    $scope.init();
}