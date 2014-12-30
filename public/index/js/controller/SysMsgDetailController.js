function SysMsgDetailController($http,$scope,$navigate,$routeParams){
    (function init(){
        $http({
            url:"/messages/"+$routeParams.msg_id+".json",
            method:"GET"
        })
            .success(function(data){
                $scope.msg = data;
            })
    })();
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
        $navigate.back()
    }
}