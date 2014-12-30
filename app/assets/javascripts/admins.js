function admin_login() {
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    if (!name || !password) {
        $('#err').html('<div class="alert alert-danger center">请输入完整信息！</div>');
        return
    }
    $.ajax({
        type: 'POST',
        url: '/admins/login_session',
        data: {'name': name, 'password': password}
    }).success(function (back) {
            if (back['data'] == 'not_find') {
                $('#err').html('<div class="alert alert-danger center">用户名或密码错误！</div>');
            }
            if (back['data'] == 'true') {
                window.location = '/admins/index'
            }
        })
}
function enter_form(event) {
    if (event.keyCode == 13) {
        $("#submit").click();
    }
}


function show_iframe(iframe_src) {
    if (iframe_src == 'all_admins') {
        $('#iframe_src').attr('src', '/admins/all_admins')
    }
    if (iframe_src == 'all_editors') {
        $('#iframe_src').attr('src', '/admins/all_editors')
    }
    if (iframe_src == 'all_users') {
        $('#iframe_src').attr('src', '/admins/all_users')
    }
    if (iframe_src == 'all_apps') {
        $('#iframe_src').attr('src', '/admins/all_apps')
    }
    if (iframe_src == 'all_gift_packs') {
        $('#iframe_src').attr('src', '/admins/all_gift_packs')
    }
    if (iframe_src == 'all_activities') {
        $('#iframe_src').attr('src', '/admins/all_activities')
    }
    if (iframe_src == 'app_basic_info') {
        $('#iframe_src').attr('src', '/admins/app_basic_info')
    }
    if (iframe_src == 'all_home_ads') {
        $('#iframe_src').attr('src', '/admins/ads_position_manage/home')
    }
    if (iframe_src == 'all_gift_ads') {
        $('#iframe_src').attr('src', '/admins/ads_position_manage/gift')
    }
    if (iframe_src == 'home_pop_ads') {
        $('#iframe_src').attr('src', '/admins/ads_position_manage/pop')
    }
    if (iframe_src == 'all_videos') {
        $('#iframe_src').attr('src', '/admins/videos_manage')
    }
    if (iframe_src == 'video_info') {
        $('#iframe_src').attr('src', '/admins/video_info')
    }
    if (iframe_src == 'strategies') {
        $('#iframe_src').attr('src', '/admins/strategies')
    }
    if (iframe_src == 'third_party_users') {
        $('#iframe_src').attr('src', '/admins/third_party_users')
    }
}

function back_to_strategies(){
    window.location='/admins/strategies'
}

function back_to_all_admins(type) {
    if (type == 'admin') {
        window.location = '/admins/all_admins'
    }
    if (type == 'editor') {
        window.location = '/admins/all_editors'
    }
}

function modify_admin_info(id, type) {
    var password = document.getElementById("password").value;
    var password_confirmation = document.getElementById("password_confirmation").value;
    if (!password || !password_confirmation) {
        $('#err').html('<div class="alert alert-danger center">请输入完整信息！</div>');
        return
    }
    if (password != password_confirmation) {
        $('#err').html('<div class="alert alert-danger center">密码输入不一致！</div>');
        return
    }
    $.ajax({
        type: 'POST',
        url: '/admins/modify_admin_info_session',
        data: {'id': id, 'password': password}
    }).success(function () {
            if (type == 'admin') {
                window.location = '/admins/all_admins'
            }
            if (type == 'editor') {
                window.location = '/admins/all_editors'
            }
        })
}

function cancle_apk(){
    localStorage.setItem("cancle","cancle");
    load_apk();
    $("#apk_loading_img").addClass("hidden");
    $("#cancle_apk").addClass("my_disabled_color");
    $("#cancle_input").attr("disabled","disabled");
    $("#fake_submit_new_app").removeAttr("disabled");
    $("#fake_submit_new_app").addClass("hidden");
    $("#submit_new_app").removeClass("hidden");


}

function cancle_ipa(){
    localStorage.setItem("cancle_ipa","cancle_ipa");
    load_ipa();
    $("#ipa_loading_img").addClass("hidden");
    $("#cancle_ipa").addClass("my_disabled_color");
    $("#cancle_ipa_input").attr("disabled","disabled");
    $("#fake_submit_new_app").removeAttr("disabled");
    $("#fake_submit_new_app").addClass("hidden");
    $("#submit_new_app").removeClass("hidden");
}


function load_apk(){
    var token=$("#token").attr("rel");
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button: 'apk_input',       //上传选择的点选按钮，**必需**
//        uptoken_url: '/admins/token',
        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        uptoken : token,
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
//        save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://fingerbang.qiniudn.com/',
        //bucket 域名，下载资源时用到，**必需**
//        container: 'load_eara',           //上传区域DOM ID，默认是browser_button的父元素，
//        max_file_size: '900mb',           //最大文件体积限制
//        flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
        max_retries: 3,                   //上传失败最大重试次数
//        dragdrop: true,                   //开启可拖曳上传
//        drop_element: 'load_eara',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
            'FilesAdded': function(up, files) {
                $("#submit_new_app").addClass("hidden");
                $("#fake_submit_new_app").attr("disabled","disabled");
                $("#fake_submit_new_app").removeClass("hidden");
                plupload.each(files, function(file) {
                    // 文件添加进队列后,处理相关的事情
                });
            },
            'BeforeUpload': function(up, file) {
                $("#apk_loading_img").removeClass("hidden");
                $("#cancle_input").removeAttr("disabled");
                $("#cancle_apk").removeClass("my_disabled_color");
//                alert("BeforeUpload")
                // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function(up, file) {
                if(localStorage.getItem("cancle")){
                    localStorage.removeItem("cancle")
                    up.trigger('Destroy', file);
                }
                // 每个文件上传时,处理相关的事情
            },
            'FileUploaded': function(up, file, info) {
                $.ajax({
                    type:'POST',
                    url:'/admins/new_apk',
                    data:{'id':$("#page-content").attr("rel"),'apk_key':file["target_name"],'apk_size':file['size'],'apk_type':file['type'],'apk_name':file['name']}
                }).success(function(){
                    $("#show_apk_input").attr('value', file["name"]);
                    $("#apk_loading_img").addClass("hidden");
                    $("#cancle_apk").addClass("my_disabled_color");
                    $("#cancle_input").attr("disabled","disabled");
                    $("#fake_submit_new_app").removeAttr("disabled");
                    $("#fake_submit_new_app").addClass("hidden");
                    $("#submit_new_app").removeClass("hidden");

                })


//                alert("FileUploaded")
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                // var domain = up.getOption('domain');
                // var res = parseJSON(info);
                // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
            },
            'Error': function(up, err, errTip) {
                //上传出错时,处理相关的事情
            },
            'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效
                var key = "";
                // do something with key here
                return key
            }
        }
    });
// domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
// uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
//}
}

function load_ipa(){
    var token=$("#token").attr("rel");
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button: 'ipa_input',       //上传选择的点选按钮，**必需**
        uptoken : token,
        unique_names: true,
        domain: 'http://fingerbang.qiniudn.com/',
        max_retries: 3,                   //上传失败最大重试次数
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
            'FilesAdded': function(up, files) {
                $("#submit_new_app").addClass("hidden");
                $("#fake_submit_new_app").removeClass("hidden");
                $("#fake_submit_new_app").attr("disabled","disabled");
                plupload.each(files, function(file) {

                });
            },
            'BeforeUpload': function(up, file) {
                $("#ipa_loading_img").removeClass("hidden");
                $("#cancle_ipa_input").removeAttr("disabled");
                $("#cancle_ipa").removeClass("my_disabled_color");
            },
            'UploadProgress': function(up, file) {
                if(localStorage.getItem("cancle_ipa")){
                    up.trigger('Destroy', file);
                    localStorage.removeItem("cancle_ipa")
                }
            },
            'FileUploaded': function(up, file, info) {
                $.ajax({
                    type:'POST',
                    url:'/admins/new_ipa',
                    data:{'id':$("#page-content").attr("rel"),'ipa_key':file["target_name"],'ipa_size':file['size'],'ipa_type':file['type'],'ipa_name':file['name']}
                }).success(function(){
                    $("#show_ipa_input").attr('value', file["name"]);
                    $("#ipa_loading_img").addClass("hidden");
                    $("#cancle_ipa").addClass("my_disabled_color");
                    $("#cancle_ipa_input").attr("disabled","disabled");
                    $("#fake_submit_new_app").removeAttr("disabled");
                    $("#fake_submit_new_app").addClass("hidden");
                    $("#submit_new_app").removeClass("hidden");

                })

            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "";
                return key
            }
        }
    });
// domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
// uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
//}
}


function reload_image(btn_id, image_input_id, show_image_input_id) {
    $('#' + btn_id).click(function () {
        $('#' + image_input_id).click();
    });
    $('#' + image_input_id).change(function () {
        for (var i = 0; i < $("#" + image_input_id)[0].files.length; i++) {
            var image_type = $("#" + image_input_id)[0].files[i].type;
            if (image_type == "image/jpeg" || image_type == "image/png" || image_type == "image/gif") {
                $('#'+show_image_input_id).attr('value', $('#'+image_input_id).val());
                localStorage.setItem("add_logo","add_logo")
            } else {
                alert('请选择格式为.jpg .png .gif的文件');
            }
        }
    });
}

function show_app_category_details() {
    $("#app_category_select").change(function () {
        $("option[id^='myadd']").addClass('hidden')
        var all_category_details = JSON.parse($("#app_category_detail_select").attr("rel").replace(/=>/g, ':'));
        for (var i = 0; i < all_category_details.length; i++) {
            if (all_category_details[i]['app_category'] == $("#app_category_select").val()) {
                $("#app_category_detail_select").append('<option id="myadd' + all_category_details[i]['name'] + '">' + all_category_details[i]['name'] + '</option>')
            }
        }
    })
}

function init_photo_input() {
    $("#photo_input").change(function (e) {
        for (var i = 0; i < $("#photo_input")[0].files.length; i++) {

            var file = e.target.files.item(i);
            var freader = new FileReader();
            freader.readAsDataURL(file);
            freader.onload = function (e) {
                var l = parseInt(localStorage.getItem("app_photo_id")) || 0;
                l += 1;
                $("#photo_reader").append("<div class='col-xs-2' id='" + l + "'><img class='app_photo_large' name='ad" + l + "'  src=" + e.target.result + "><a class='close_mark' rel='" + l + "' onclick='delete_photo(this)'>&times</a></div>")
                localStorage.setItem("app_photo_id", l)
            }
        }
    })
}

function delete_auto_load_photo(btn) {
    $("#" + $(btn).attr("rel")).html('');
    var delete_photo_num = JSON.parse(localStorage.getItem("delete_photo_num")) || [];
    delete_photo_num.push($(btn).attr("name"));
    localStorage.setItem("delete_photo_num", JSON.stringify(delete_photo_num))
}

function init_app_basic_info() {
    if ($("#recommend").attr("rel") == 'recommend') {
        $("#recommend").click();
    }
    $("#app_category_select").val($("#app_category_select").attr("rel"));
    var all_category_details = JSON.parse($("#app_category_detail_select").attr("rel").replace(/=>/g, ':'));
    for (var i = 0; i < all_category_details.length; i++) {
        if (all_category_details[i]['app_category'] == $("#app_category_select").val()) {
            $("#app_category_detail_select").append('<option id="myadd' + all_category_details[i]['name'] + '">' + all_category_details[i]['name'] + '</option>')
        }
    }
    $("#app_category_detail_select").val($("#app_category_detail_option").attr("rel"))
    if ($("#price_rel").attr("rel") != '空') {
        if (parseInt($("#price_rel").attr("rel")) > 0) {
            $("#paid_radio").click();
            $("#price_input").val(parseInt($("#price_rel").attr("rel")));
        }
        if (parseInt($("#price_rel").attr("rel")) == 0) {
            $("#price_rel").click();
        }
        if (parseInt($("#price_rel").attr("rel")) == -1) {
            $("#limit_free").click();
        }
    }

    if(localStorage.getItem('back_show_all_apps_url') == 'show_all_apps'){
        localStorage.removeItem('back_show_all_apps_url');
        $("#post_tips").removeClass('hide')
            .addClass('post-tip')
            .html('上传成功！');
        back_to_all_app();
    }
}

function delete_photo(btn) {
    $("#" + $(btn).attr("rel")).html('');
}


function post_photo(){
    var current_url_array = window.location.toString().split('/');
    if(current_url_array[current_url_array.length-1] == 'app_basic_info'){
        localStorage.setItem('back_show_all_apps_url','show_all_apps');
    }

    var app_name = $('#app_name').val();
    if(!app_name){
        alert('请输入应用名称');
        return;
    }
    $("#post_tips").removeClass('hide')
        .addClass('post-tip')
        .html('正在上传数据,请耐心等待...');
    var reload_logo=document.getElementById("show_logo_input").value!="" && localStorage.getItem("add_logo")=="add_logo";
    if($('[name*=ad]').length!=0 ||reload_logo){
        $('#loaderModal').modal('show');
    }
    var delete_photo_num=JSON.parse(localStorage.getItem("delete_photo_num")) || 'false';
    var id=$("#page-content").attr("rel");
    var img_view=$('[name*=ad]');
    var imgs=[];
    for(var i=0;i<img_view.length;i++){
        var src = img_view[i].src;
        imgs.push(src)
    }
    $.ajax({
        type: "POST",
        url: '/admins/app_photo',
        data: {"photo_files": imgs, "app_id": id, "delete_photo_nums": delete_photo_num}
    }).done(function(){
        $("#fake_submit_new_app").click();
    })
}

function show_app_info(id) {
    parent.window.location = '/admins/app_info?id=' + id
}

function back_to_all_app() {
    var back_data = {status: 1, back_id: 'all_app'};
    save_back_data(back_data);
    parent.window.location = '/admins/index';
}

function reload_apk(btn_id,apk_input_id,show_apk_input_id) {
    $('#'+btn_id).click(function () {
        $('#'+apk_input_id).click();
    });
}

function refresh_page(url){
    window.location=url;
}

function reload_ipa(btn_id,ipa_input_id,show_ipa_input_id) {
    $('#'+btn_id).click(function () {
        $('#' + ipa_input_id).click();
    })
}
function save_back_data(back_data) {
    localStorage.setItem('back_data', JSON.stringify(back_data));
}

function add_new_admin(admin_type) {
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    var password_confirmation = document.getElementById("password_confirmation").value;
    if (!name || !password || !password_confirmation) {
        $('#err').html('<div class="alert alert-danger center">请输入完整信息！</div>');
        return
    }
    if (password != password_confirmation) {
        $('#err').html('<div class="alert alert-danger center">密码输入不一致！</div>');
        return
    }
    $.ajax({
        type: 'POST',
        url: '/admins/new_admin_session',
        data: {'name': name, 'password': password, 'admin_type': admin_type}
    }).success(function (back) {
            if (back['data'] == 'repeated') {
                $('#err').html('<div class="alert alert-danger center">用户名重复！</div>');
            }
            if (back['data'] == 'true') {
                if (admin_type == 'admin') {
                    window.location = '/admins/all_admins'
                }
                if (admin_type == 'editor') {
                    window.location = '/admins/all_editors'
                }

            }
        })
}

function back_all_gift_pack_page() {
    window.location = '/admins/all_gift_packs';
}

function back_all_activities_page() {
    window.location = '/admins/all_activities';
}

function post_strategy_data(){
    if ($("#list_img_file")[0].files[0]){
        var list_img_type=$("#list_img_file")[0].files[0].type;
        if (!(list_img_type == "image/jpeg" || list_img_type == "image/png" || list_img_type == "image/gif")){
            alert("上传视频在列表中的显示图的格式为.jpg .png .gif文件");
            return
        }
    }
    if($("#video_img_file")[0].files[0]){
        var video_img_type=$("#video_img_file")[0].files[0].type;
        if (!(video_img_type == "image/jpeg" || video_img_type == "image/png" || video_img_type == "image/gif")){
            alert("上传视频封面图的格式为.jpg .png .gif文件");
            return;
        }
    }
    var name=$("#name").val(),
        video_link=$("#video_link").val(),
        detail_content=$("#editor").html()
        app_id=$("#app_id").val(),
        url = window.location.pathname,
        fake_list_img=$("#list_img_input").val(),
        fake_video_img=$("#video_img_input").val(),
        strategy_id=$("#strategy_id").val(),
        list_img=localStorage.getItem("list_img_file"),
        video_img=localStorage.getItem("video_img_file");
    if(!name){
        alert('请输入攻略名称');
        return;
    }
    $("#post_tips").removeClass('hide');

    $.ajax({
        type: "POST",
        url: url,
        data:{"name":name,"video_link":video_link,"detail_content":detail_content,"list_img":list_img,"strategy_id":strategy_id,
            "video_img":video_img,"app_id":app_id,"fake_list_img":fake_list_img,"fake_video_img":fake_video_img}
    }).success(function(){
        window.location='/admins/strategies'
    })


}

function post_gift_pack_data() {
    var name = $("#name").val(), amount = $("#amount").val()==''?0:$("#amount").val(),
        type = $("#gift_packs_select").find("option:selected").text(),
        is_deduct = $('#is_deduct')[0].checked, deduct_integral = $("#deduct_integral").val(),permanent = $('#permanent')[0].checked,
        begin_time = JSON.parse(localStorage.getItem('begin_time'))||'0/0/0', end_time = JSON.parse(localStorage.getItem('end_time'))||'0/0/0',
        details = $("#editor_gift_pack_detail").html(), card_nums = $("#editor_gift_pack_card_nums").val().replace( /\s/g,""),
        post_url = '', current_url = window.location.pathname;

    if(!name){
        alert('请输入礼包名称');
        return;
    }

    if(!permanent){
        var is_legal_applicable_time = judge_time(begin_time,end_time);
        if(!is_legal_applicable_time){
            alert('请确定适用时间的起始日期。。。');
            return;
        }
    }
    if (current_url == '/admins/add_gift_pack') {
        post_url = "/admins/save_gift_pack.json"
    }
    if (current_url == '/admins/gift_pack_detail') {
        post_url = "/admins/update_gift_pack.json"
    }
    $("#post_tips").removeClass('hide');

    $.ajax({
        type: "POST",
        url: post_url,
        data: {'name': name, 'amount': amount, 'gift_pack_type': type == '--请选择类别--' ? '' : type,
            'deduct_integral': is_deduct ? deduct_integral : 0, 'applicable_time': permanent ? '永久' : begin_time + '至' + end_time,
            'detail': details, 'card_nums': card_nums}
    }).done(function (data) {
            if (data.status == 1) {
                clear_begin_end_time();
                window.location = '/admins/all_gift_packs';
            }
        })
}

function post_activity_data() {
    var name = $("#name").val(), type = $("#activity_type_select").find("option:selected").text(),
        is_deduct = $('#is_deduct')[0].checked, deduct_integral = $("#deduct_integral").val(),
        permanent = $('#permanent')[0].checked,
        begin_time = JSON.parse(localStorage.getItem('begin_time'))||'0/0/0',
        end_time = JSON.parse(localStorage.getItem('end_time'))||'0/0/0',
        details = $("#editor_activity_detail").html(),
        post_url = '', current_url = window.location.pathname;

    if(!name){
        alert('请输入活动名称');
        return;
    }

    if(!permanent){
        var is_legal_activity_time = judge_time(begin_time,end_time);
        if(!is_legal_activity_time){
            alert('请确定活动的起始日期。。。');
            return;
        }
    }
    if (current_url == '/admins/new_activity') {
        post_url = "/admins/save_activity.json"
    }
    if (current_url == '/admins/activity_detail') {
        post_url = "/admins/update_activity.json"
    }
    $("#post_tips").removeClass('hide');
    $.ajax({
        type: "POST",
        url: post_url,
        data: {'name': name, 'activity_type': type == '--请选择类别--' ? '' : type,
            'deduct_integral': is_deduct ? deduct_integral : 0, 'activity_time': permanent ? '永久' : begin_time + '至' + end_time,
            'detail': details}
    }).done(function (data) {
            if (data.status == 1) {
                clear_begin_end_time();
                window.location = '/admins/all_activities';
            }
        })
}


function clear_begin_end_time() {
    localStorage.removeItem('begin_time');
    localStorage.removeItem('end_time');
}

function judge_time(begin_time,end_time){
    if(begin_time == -1 || end_time == -1){
        return false;
    }
    var begin_date = new Date(begin_time.split('/')[0],begin_time.split('/')[1],begin_time.split('/')[2]),
        end_date = new Date(end_time.split('/')[0],end_time.split('/')[1],end_time.split('/')[2]);
    if(begin_date<end_date){
        return true;
    }
    return false;
}

function set_permanent_btn_change(){
    $("#permanent").click(function(){
        set_time_select_disabled();
    })
}

function set_deduct_integral_status() {
    var deduct_integral = $("#is_deduct").attr('rel');
    if(deduct_integral>0){
        $("#deduct_integral").val(deduct_integral);
        $("#is_deduct").click();
    }else{
        $("#no_deduct").click();
        $("#deduct_integral").attr('disabled','disabled');
    }

    $("#is_deduct").click(function(){
        $("#deduct_integral").removeAttr('disabled').val(deduct_integral);
    });
    $("#no_deduct").click(function(){
        $("#deduct_integral").attr('disabled','disabled').val('');
    });
}

function set_time_status(time_id) {
    var permanent = $("#"+time_id).attr('rel').replace( /\s/g,"");
    if(permanent == '永久'){
        $("#permanent").click();
    }
    if(permanent != '永久'){
        var time = $("#"+time_id).attr('rel').split('至');
        var begin_time = time[0].split('/'),
            end_time = time[1].split('/');

        localStorage.setItem('begin_time',JSON.stringify(time[0]));
        localStorage.setItem('end_time',JSON.stringify(time[1]));

        var begin_selects = document.getElementById("begin").getElementsByTagName("select"),
            end_selects = document.getElementById("end").getElementsByTagName("select");

        setTimeout(setSelected(begin_selects[0],begin_time[0]+'年'),500);
        setTimeout(setSelected(begin_selects[1],begin_time[1]+'月'),10);
        setTimeout(setSelected(begin_selects[2],begin_time[2]+'日'),10);

        setTimeout(setSelected(end_selects[0],end_time[0]+'年'),10);
        setTimeout(setSelected(end_selects[1],end_time[1]+'月'),10);
        setTimeout(setSelected(end_selects[2],end_time[2]+'日'),10);
    }
    set_time_select_disabled();
}

function set_time_select_disabled(){
    var is_checked = $("#permanent")[0].checked;
    if(is_checked){
        $("#begin select").attr('disabled','disabled');
        $("#end select").attr('disabled','disabled');
    }
    if(!is_checked){
        $("#begin select").removeAttr('disabled');
        $("#end select").removeAttr('disabled');
    }
}

function setSelected(selectObj,optionsText){
    for(var i=0;i<selectObj.options.length;i++){
        if(selectObj.options[i].text==optionsText){
            selectObj.options[i].selected=true;
        }
    }
}