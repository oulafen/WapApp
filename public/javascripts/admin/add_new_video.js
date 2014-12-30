$(document).ready(function () {

    $("input[type=file]").change(function () {
        $('#video_' + this.id + '_local_path').attr('value', $('#' + this.id).val());
    });

    bind_video_img_file_change('video_img_1');
});

function bind_video_img_file_change(id) {
    $("#" + id).change(function () {
        var pre_num              = Number(_(this.id.split('_')).last()),
            new_video_img_file_id = 'video_img_' + (pre_num + 1);

        $("#video_img_row").append("<input accept='image/png,image/gif,image/jpeg' id='" + new_video_img_file_id + "' name='video[video_imgs_attributes][][img]' style='display:none' type='file'>");
        $("#video_img_label").attr('for', new_video_img_file_id);
        bind_video_img_file_change(new_video_img_file_id);

        _(this.files).each(function (file) {
            var file_reader = new FileReader();
            file_reader.readAsDataURL(file);
            file_reader.onload = function (event) {
                $("#photo_reader").append("<div class='col-xs-2' id='" + pre_num + "'><img class='app_photo_large' name='video_img_preview" + pre_num + "'  src=" + event.target.result + "><a class='close_mark' rel='" + pre_num + "' onclick='remove_preview_video_img(this)'>&times</a></div>");
            };
        });
    })
}

function remove_preview_video_img(target) {
    var removed_id = $(target).attr("rel");
    console.log("#video_img_" + removed_id);
    $("#video_img_" + removed_id).detach();
    $("#" + removed_id).detach();
}

function submit_video_form() {
    var video_name = $('#video_name').val(), video_video_link = $("#video_video_link").val(),
        video_list_img_local_path = $("#video_list_img_local_path").val(),video_cover_local_path = $("#video_cover_local_path").val(),
        video_intro = $("#video_intro"),video_img_list = $("input[id^=video_img_]"),
        belle = $("#belle")[0].checked,hot = $("#hot")[0].checked, raiders = $("#raiders")[0].checked;
    if(!(video_name && video_video_link && video_list_img_local_path && video_cover_local_path && video_intro && video_img_list[2] && (belle || hot || raiders)) ){
        alert('请将信息填写完整');
        return;
    }

    $("#video_form").ajaxSubmit({
        target:"#video_post_tips",
        type: "post",
        dataType: "script",
        beforeSubmit: function(formData, jqForm, options){
            $("#video_post_tips")
                .removeClass('post-error')
                .addClass('post-tip')
                .html('正在上传数据,请耐心等待...');
            return true;
        },

        success: function (msg) {
            console.log(msg);
            if (msg) {
                return window.location = '/admins/videos_manage'
            }
            $("#video_post_tips")
                .removeClass('post-tip')
                .addClass('post-error')
                .html('上传失败！')
        },

        error: function (msg) {
            $("#video_post_tips")
                .removeClass('post-tip')
                .addClass('post-error')
                .html('网络异常！');
        }
    });
}