function IntegralRulesController($scope,$navigate){

    $scope.go_back = function(){
      $navigate.back();
    };

    $scope.go_user_improve_info = function(){
      $navigate.go('/user/new');
    };

    $scope.go_login = function(){
        $navigate.go('/login/');
    };

    $scope.red_bird_src = 'img/red-bird.png';
    $scope.yellow_bird_src = 'img/yellow-bird.png';
    $scope.green_bird_src = 'img/green-bird.png';
    $scope.blue_bird_src = 'img/blue-bird.png';
}