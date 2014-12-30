function CurrentDownloadAppsController($scope, $navigate, $http) {
    $http({
        method: 'POST',
        url: '/back_current_download_apps',
        data: {'user_mailbox':JSON.parse(localStorage.getItem("user"))['mailbox']}
    }).success(function (back) {
        $scope.apps = back['data']
    });

    $scope.go_personal_center=function(){
        $navigate.go("/user/personal_center")
    }

    var top        = document.body.clientWidth * 20 / 640 + 'px',
        left_right = document.body.clientWidth * 20 / 640  + 'px';
    $scope.ul_padding    = 'padding:' + '0 ' + left_right + ' 0' + left_right;
    $scope.li_tag_margin = 'margin:' + top + ' 0 '+ '0 ' + '0 ';
}