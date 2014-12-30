function ShareController($scope,$navigate){

    $scope.go_more=function(){
        $navigate.go("/more")
    };

    $scope.share_to_sina=function(){
      WB2.anyWhere(function(W){
        W.widget.publish({
            'id' : 'wb_publish',
            'default_text' : $('#share_content').html(),
            'callback' : function(o) {
                window.location='/index/#/more'
            }
        });
    });
    };

    $scope.share_to_tencent=function() {
        var _t = encodeURI($('#share_content').html());
        var _url = encodeURIComponent(document.location);
        var _appkey = "801192940";
        var _pic = encodeURI('');//
        var _site = '';//你的网站地址，可以留空
        var _u = 'http://v.t.qq.com/share/share.php?url='+_url+'&appkey='+_appkey+'&site='+_site+'&pic='+_pic+'&title='+_t;
        window.open( _u,'', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no' );
    }

}