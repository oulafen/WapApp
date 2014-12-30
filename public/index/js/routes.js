myModule.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "pages/home_pop_ad.html",
        controller: HomePopAdController
    })
        .when("/search", {
            templateUrl: "pages/search.html",
            controller: SearchController
        })
        .when("/home", {
            templateUrl: "pages/index.html",
            controller: IndexController
        })
        .when("/user/messages", {
            templateUrl: "pages/messages_list.html",
            controller: MessagesController
        })
        .when("/user/forget_password",{
            templateUrl:"pages/forget_password.html",
            controller:ForgetPasswordController
        })
        .when("/user/new", {
            templateUrl: "pages/user_improve_info.html",
            controller: UserImproveInfoController
        })
        .when("/login/:params", {
            templateUrl: "pages/login.html",
            controller: LoginController
        })
        .when("/user/personal_center", {
            templateUrl: "pages/personal_center.html",
            controller: PersonalCenterController
        })
        .when("/user/personal_center/topics_about_me",{
            templateUrl:"pages/bbs_about_me.html",
            controller:BBSAboutMeController
        })
        .when("/user/reset_password", {
            templateUrl: "pages/reset_password.html",
            controller: ResetPasswordController
        })
        .when("/app_detail", {
            templateUrl: "pages/app_detail.html",
            controller: AppDetailController
        })
        .when("/sys_msg_detail/:msg_id",{
            templateUrl:"pages/sys_msg_detail.html",
            controller:SysMsgDetailController
        })
        .when("/app_gift_packs/:app_id/:app_name", {
            templateUrl: "pages/app_gift_pack_list.html",
            controller: AppGiftPackListController
        })
        .when("/app_activities/:app_id/:app_name", {
            templateUrl: "pages/app_activities_list.html",
            controller: AppActivityListController
        })
        .when("/activity_detail/:activity_id", {
            templateUrl: "pages/activity_detail.html",
            controller: ActivityDetailController
        })
        .when("/video_detail/:video_id", {
            templateUrl: "pages/video_detail.html",
            controller: VideoDetailController
        })
        .when("/gift_pack_detail/:gift_pack_id", {
            templateUrl: "pages/gift_pack_detail.html",
            controller: GiftPackDetailController
        })
        .when("/bbs/:page", {
            templateUrl: "pages/bbs.html",
            controller: BBSController
        })
        .when("/topic_detail/:topic_id", {
            templateUrl:"pages/topic_detail.html",
            controller:TopicDetailController
        }).when("/current_download_apps",{
            templateUrl:"pages/current_download_apps.html",
            controller:CurrentDownloadAppsController
        })
        .when("/all_gift_packs", {
            templateUrl:"pages/all_gift_packs.html",
            controller:AllGiftPacksController
        })
        .when("/all_gift_packs/:filter",{
            templateUrl:"pages/gift_pack_activity_filter_list.html",
            controller:GiftPackActivityFilterList
        })
        .when("/my_activities", {
            templateUrl:"pages/my_activities.html",
            controller:MyActivitiesController
        })
        .when("/my_gift_packs", {
            templateUrl:"pages/my_gift_packs.html",
            controller:MyGiftPacksController
        })
        .when("/video_strategy_detail/:id",{
            templateUrl:'pages/video_strategy_detail.html',
            controller:VideoStrategyDetailController
        })
        .when('/text_strategy_detail/:id',{
            templateUrl:'pages/text_strategy_detail.html',
            controller:TextStrategyDetailController
        })
        .when("/more",{
            templateUrl:"pages/more.html",
            controller:MoreController
        })
        .when("/feedback",{
            templateUrl:"pages/feedback.html",
            controller:FeedBackController
        })
        .when("/video_list/:type", {
            templateUrl: "pages/video_list.html",
            controller: VideoListController
        })
        .when("/app_list/:type", {
            templateUrl: "pages/app_list.html",
            controller: AppListController
        })
        .when("/user/reset_password_via_email/:code",{
            templateUrl:"pages/reset_password.html",
            controller:EmailResetPasswordController
        })
        .when("/share",{
            templateUrl:"pages/share.html",
            controller:ShareController
        })
        .when("/share_app/:id",{
            templateUrl:"pages/share_app.html",
            controller:ShareAppController
        })
        .when("/integral_rules",{
            templateUrl:"pages/integral_rules.html",
            controller:IntegralRulesController
        })
        .otherwise({
            redirectTo: "/"
        });
});