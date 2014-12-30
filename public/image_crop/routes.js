myModule.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: './image_crop.html',
        controller: ImageCropController
    })
        .otherwise({
            redirectTo: "/"
        });
});