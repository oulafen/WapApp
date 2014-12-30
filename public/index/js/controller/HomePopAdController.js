function HomePopAdController($scope, $navigate, $http, $timeout) {
    $http({
        method: 'POST',
        url: '/ads_data',
        data: {position: 'pop'}
    }).success(function (respond_data) {
            $scope.pop_ad = respond_data['ads'][0];
            if (!$scope.pop_ad) {
                $navigate.go('/home');
            }
        });

}