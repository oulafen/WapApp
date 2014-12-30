var myModule = angular.module('myApp', ['mobile-navigate']);

myModule.run(function($route, $http, $templateCache,$rootScope,$navigate) {
    angular.forEach($route.routes, function(r) {
        if (r.templateUrl) {
            $http.get(r.templateUrl, {cache: $templateCache});
        }
    });
});

myModule.controller('MainCtrl', function($scope, $navigate) {
    $scope.$navigate = $navigate;
});

myModule.directive('ngTap', function() {
    var isTouchDevice = !!("ontouchstart" in window);
    return function(scope, elm, attrs) {
        if (isTouchDevice) {
            var tapping = false;
            elm.bind('touchstart', function() { tapping = true; });
            elm.bind('touchmove', function() { tapping = false; });
            elm.bind('touchend', function() {
                tapping && scope.$apply(attrs.ngTap);
            });
        } else {
            elm.bind('click', function() {
                scope.$apply(attrs.ngTap);
            });
        }
    };
});

myModule.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

myModule.directive('ngFocus', function ($timeout) {
    return {

        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('focus', function (n, o) {
                var is_iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
                if (!is_iOS) return;
                $timeout(function () {
                    document.getElementsByTagName('header')[0].style.position = 'absolute';
                }, 0);
            });
        }
    };
});

myModule.directive('ngBlur', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('blur', function () {
                var is_iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
                if (!is_iOS) return;
                $timeout(function () {
                    if (document.activeElement.tagName != 'INPUT') {
                        window.scrollTo(0, 0);
                    } else {
                        window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
                    }
                    document.getElementsByTagName('header')[0].style.position = 'fixed';
                }, 0);
            });
        }
    };
});

myModule.directive('ngCustomInput', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<input ng-focus=true ng-blur=true>'
    }
});

myModule.directive('ngCustomTextrea', function () {
    return {
        restrict: "E",
        replace: true,
        template: '<textarea ng-focus=true ng-blur=true>'
    }
});

myModule.directive('giftPackDetail', function ($compile,$http,$routeParams) {
    return {
        restrict: "E",
        replace: true,
        link: function ($scope, $element) {
            $http({
                method: 'POST',
                url: '/back_one_gift_pack',
                data: {'id': $routeParams.gift_pack_id}
            }).success(function (back) {
                    $element.html(back['data'].detail);
                    $compile($element.contents())($scope);
                });
        }
    }
});

myModule.directive('appIntroduce', function ($compile,$http,$routeParams) {
    return {
        restrict: "E",
        replace: true,
        link: function ($scope, $element) {
            $http({
                method: 'POST',
                url: '/back_this_app',
                data: {'id': localStorage.getItem("app_id")}
            }).success(function (back) {
                    $element.html(back['data'].introduce);
                    $compile($element.contents())($scope);
                });
        }
    }
});

myModule.directive('videoIntroduce', function ($compile,$http,$routeParams) {
    return {
        restrict: "E",
        replace: true,
        link: function ($scope, $element) {
            $http({
                method: 'POST',
                url: '/back_this_video',
                data: {id: $routeParams.video_id}
            }).success(function(respond_data) {
                    $element.html(respond_data['video'].intro);
                    $compile($element.contents())($scope);
                });
        }
    }
});

myModule.directive('activityDetail', function ($compile,$http,$routeParams) {
    return {
        restrict: "E",
        replace: true,
        link: function ($scope, $element) {
            $http({
                method: 'POST',
                url: '/back_one_activity',
                data: {'id': $routeParams.activity_id}
            }).success(function (back) {
                    $element.html(back['data'].detail);
                    $compile($element.contents())($scope);
                });
        }
    }
});

myModule.directive('videoStrategyDetail', function ($compile,$http,$routeParams) {
    return {
        restrict: "E",
        replace: true,
        link: function ($scope, $element) {
            $http({
                method:'POST',
                url:'/back_strategy_detail',
                data:{'id':$routeParams.id}
            }).success(function(back){
                $element.html(back['strategy'].detail_content);
                $compile($element.contents())($scope);
            });
        }
    }
});

myModule.directive('timelinejs',  function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            postpone = $timeout(function() {
                $(function(){
                    $().timelinr({
                        orientation: 	'vertical',
//                        issuesSpeed: 	300,
//                        datesSpeed: 	100,
                        arrowKeys: 		'true',
                        startAt:		3,
                        mousewheel:		'true'
                    });
                })
            }, 0);
        }
    }
});

var myScrollInterval = null;

myModule.directive('infiniteScroll', [
    '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
        return {
            link: function(scope, elem, attrs) {
                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
//              myWindow = angular.element($window);
            myScrollInterval = window.setInterval(function(){
                myWindow = $('.infinite-scroll');

                if(!!myWindow[0]){
                    infinite_scroll();
                    window.clearInterval(myScrollInterval);
                    myScrollInterval = null;
                }
            },500);

                function infinite_scroll (){
                    scrollDistance = 0;
                    if (attrs.infiniteScrollDistance != null) {
                        scope.$watch(attrs.infiniteScrollDistance, function(value) {
                            return scrollDistance = parseInt(value, 10);
                        });
                    }
                    scrollEnabled = true;
                    checkWhenEnabled = false;
                    if (attrs.infiniteScrollDisabled != null) {
                        scope.$watch(attrs.infiniteScrollDisabled, function(value) {
                            scrollEnabled = !value;
                            if (scrollEnabled && checkWhenEnabled) {
                                checkWhenEnabled = false;
                                return handler();
                            }
                        });
                    }
                    handler = function() {
                        var elementBottom, remaining, shouldScroll, windowBottom;
                        windowBottom = myWindow.height() + myWindow.scrollTop();
                        elementBottom = elem.offset().top + elem.height();
                        remaining = elementBottom - windowBottom;
                        shouldScroll = remaining <= myWindow.height() * scrollDistance;
                        if (shouldScroll && scrollEnabled) {
                            if ($rootScope.$$phase) {
                                return scope.$eval(attrs.infiniteScroll);
                            } else {
                                return scope.$apply(attrs.infiniteScroll);
                            }
                        } else if (shouldScroll) {
                            return checkWhenEnabled = true;
                        }
                    };

                    myWindow.on('scroll', handler);

                    scope.$on('$destroy', function() {
                        return myWindow.off('scroll', handler);
                    });
                    return $timeout((function() {
                        if (attrs.infiniteScrollImmediateCheck) {
                            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                                return handler();
                            }
                        } else {
                            return handler();
                        }
                    }), 0);
                }
            }
        };
    }
]);

myModule.directive('imageonload', function($navigate,$timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                $timeout(function () {
                    $navigate.go('/home');
                }, 3000);
            });
        }
    };
});

myModule.factory('List', function($http) {

    var List = function(method, url, postData) {
        this.listData = [];
        this.busy     = false;
        this.after    = 2;
        this.method   = method;
        this.url      = url;
        this.postData = postData;
        this.loading  = true;
    };

    List.prototype.nextPage = function() {
        if (this.busy) return;
        this.busy          = true;
        this.postData.page = this.after;
        $http({
            method : this.method,
            url    : this.url,
            data   : this.postData
        }).success(function (respondData) {
                if(respondData['data']) {
                    _(respondData['data']).each(function (item) {
                        this.listData.push(item);
                    }.bind(this));
                    if(!respondData['data'][0]){
                        this.loading = false;
                    }
                    this.after += 1;
                    this.busy = false;
                }
            }.bind(this));
    };

    return List;
});


myModule.factory('slider', function() {
   return {
      config : function (hasPagination) {
              var options = {
                  width: 100,
                  height: 100,
                  start: 1,
                  navigation: {
                      active: false,
                      effect: "slide"
                  },
                  pagination: {
                      active: hasPagination,
                      effect: "slide"
                  },
                  play: {
                      active: false,
                      effect: "slide",
                      interval: 3000,
                      auto: true,
                      swap: true,
                      pauseOnHover: false,
                      restartDelay: 2500
                  },
                  effect: {
                      slide: {
                          speed: 800
                      },
                      fade: {
                          speed: 800,
                          crossfade: true
                      }
                  },
                  callback: {
                      loaded: function() {},
                      start: function() {},
                      complete: function() {}
                  }
              };
          $('#slides').slidesjs(options);
      }
   };
});
$(document).ready(function(){
    if(localStorage.is_tencent_login == undefined){
        localStorage.is_tencent_login = false;
    }
})
var js = function (data) {
    data = data.data;
    $.ajax({
        method: 'POST',
        url: '/third_party_user',
        data: {'name': data.nick, "from": '腾讯微博', "third_party_id": data.openid, "head": data.head+"/120"},
        success:function (back) {
            localStorage.removeItem("tencent");
            localStorage.is_tencent_login = true;
            localStorage.setItem("third_party_user", JSON.stringify(back));
            localStorage.setItem("third_login","third_login")
            window.location = "http://"+window.location.hostname+"/index/#/home"
        }
    });
};


