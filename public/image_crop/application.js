var myModule = angular.module('myApp', ['mobile-navigate']);

myModule.run(function ($route, $http, $templateCache, $rootScope, $navigate) {
    angular.forEach($route.routes, function (r) {
        if (r.templateUrl) {
            $http.get(r.templateUrl, {cache: $templateCache});
        }
    });
});

myModule.controller('MainCtrl', function ($scope, $navigate) {
    $scope.$navigate = $navigate;
});

myModule.directive('ngTap', function () {
    var isTouchDevice = !!("ontouchstart" in window);
    return function (scope, elm, attrs) {
        if (isTouchDevice) {
            var tapping = false;
            elm.bind('touchstart', function () {
                tapping = true;
            });
            elm.bind('touchmove', function () {
                tapping = false;
            });
            elm.bind('touchend', function () {
                tapping && scope.$apply(attrs.ngTap);
            });
        } else {
            elm.bind('click', function () {
                scope.$apply(attrs.ngTap);
            });
        }
    };
});

myModule.directive('imageonload', function ($navigate, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                var jcrop = null;
                var screen_width = $("#wrapper").width();
                var selectX = screen_width * 0.25,
                    selectY = screen_width * 0.25,
                    selectX1 = screen_width * 0.75,
                    selectY1 = screen_width * 0.75;
                mySrc = $('#sourseImage').attr('src');


                var sourseImg = new Image();
                sourseImg.src = mySrc;

                initCrop();

                function initCrop() {
                    jcrop = $.Jcrop("#sourseImage", {
                        trackDocument: true,
                        onChange: updatePosition,
                        aspectRatio: 1,
                        bgOpacity: .2,
                        setSelect: [ selectX, selectY, selectX1, selectY1 ],
                        allowSelect: false,
                        handleSize: 20
//                        onSelect: updatePosition
                    });

                    function updatePosition(img) {
                        if (parseInt(img.w) > 0) {
                            localStorage.setItem('cropSelectSize', JSON.stringify({'x': img.x, 'y': img.y, 'w': img.w, 'h': img.h}));
                        }
                    }
                }

                scope.$on('DestroyJcrop', destroy);
                function destroy() {
                    jcrop.destroy();
                }
            });
        }
    };
});

