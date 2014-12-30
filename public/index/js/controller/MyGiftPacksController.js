function MyGiftPacksController($scope, $navigate, $http, $timeout) {

    $scope.go_back = function () {
        $navigate.back()
    };

    $http({
        method: 'POST',
        url: '/back_my_gift_packs',
        data: {'mailbox':User.get_current_user().mailbox }
    }).success(function (back) {
            $scope.my_gift_packs = back['data']
        });

    $scope.go_gift_pack_detail = function (app_id,gift_pack_id) {
        localStorage.setItem('app_id',app_id);
        $navigate.go('/gift_pack_detail/' + gift_pack_id);
    };

    $scope.select_card_num = function (index) {
        $scope.card_num = $scope.my_gift_packs[index].gift_pack_card_num;
        $timeout(function(){
            $('#copy-modal').modal('show');
        },500)
    };

    $scope.close_modal = function(){
        $('#copy-modal').modal('hide');
    };

    var top = document.body.clientWidth * 20 / 640 + 'px',
        left_right = document.body.clientWidth * 20 / 640  + 'px';
    $scope.ul_padding    = 'padding:' + '0 ' + left_right + ' 0' + left_right;
    $scope.li_tag_margin = 'margin:' + top + ' 0 '+ '0 ' + '0 '
}