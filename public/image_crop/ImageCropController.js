function ImageCropController($scope, $http, $navigate, $timeout) {

    while (!(logo_data = localStorage.getItem('logo_data'))) {
    }

    $scope.img = logo_data;
    var image = new Image();
    image.src = logo_data;

    $scope.save_crop_logo = function () {
        var crop_select_size = JSON.parse(localStorage.getItem('cropSelectSize'));
        var screen_width = $("#wrapper").width();
        var screen_height = $("#wrapper").height();
        var sourseImg = new Image();
        sourseImg.src = logo_data;

        var sourseImgWidth = sourseImg.width;
        var sourseImgHeihgt = sourseImg.height;

        var canvas = $("#preview")[0];
        var context = canvas.getContext("2d");


        context.drawImage(sourseImg,
            crop_select_size.x / screen_width * sourseImgWidth,
            crop_select_size.y / screen_height * sourseImgWidth,
            crop_select_size.w / screen_width * sourseImgWidth,
            crop_select_size.h / screen_width * sourseImgWidth,
            0, 0, canvas.width, canvas.height);


        myImage = canvas.toDataURL("image/png");


        localStorage.setItem('crop_logo_data', JSON.stringify(myImage));

        if (User.is_login()) {
            var user = User.get();
            if (user) {
                user.logo = User.get_logo();
                User.save(user);
            }
            $scope.$broadcast('DestroyJcrop');
            localStorage.removeItem('cropSelectSize');
        }
        if (!User.is_login()) {
            $scope.$broadcast('DestroyJcrop');
            localStorage.removeItem('logo_data');
            localStorage.removeItem('cropSelectSize');
        }
        history.back();
    };

    $scope.go_back = function () {
        $scope.$broadcast('DestroyJcrop');
        User.clear_logo();
        localStorage.removeItem('cropSelectSize');
        window.location.href = User.get_current_url();
    };

}