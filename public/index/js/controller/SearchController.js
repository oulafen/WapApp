function SearchController ($scope, $navigate,$http) {
    (function init(){
        $scope.app_results = [];
        $scope.video_results = [];

        if(localStorage.back_to_search == "true"){
            $scope.app_results = JSON.parse(localStorage.app_search_result);
            $scope.video_results = JSON.parse(localStorage.video_search_result);
            $scope.search_key = localStorage.search_key;
            localStorage.back_to_search = false;
        }
    })();

	$scope.back_to_home = function () {
		$navigate.go("/home")
	}
    $scope.start_search =function(){
        if($scope.search_key == undefined || $scope.search_key == "")
        {
            return ;
        }
        $http({
            url:"/search/index.json?key="+$scope.search_key,
            method:"GET"
        })
            .success(function (data, status, headers, config){
                $scope.app_results = data.App;
                $scope.video_results = data.Video;
            })
            .error(function (data, status, headers, config) {
            });
    }
    $scope.go_video_detail = function(video_id){
        $navigate.go("/video_detail/"+video_id);
        localStorage.from_search = true;
        localStorage.app_search_result = JSON.stringify($scope.app_results);
        localStorage.video_search_result = JSON.stringify($scope.video_results);
        localStorage.search_key = $scope.search_key;
    }

    $scope.cut_introduce = function(str){
        return str.length > 35 ? str.substr(0,35)+"...":str;
    }

    $scope.go_app_detail = function(app_id){
        localStorage.app_id = app_id;
        $navigate.go("/app_detail")
        localStorage.from_search = true;
        localStorage.app_search_result = JSON.stringify($scope.app_results);
        localStorage.video_search_result = JSON.stringify($scope.video_results);
        localStorage.search_key = $scope.search_key;
    }

    $scope.go_to_page = function(url){
        $navigate.go(url);
    };
}