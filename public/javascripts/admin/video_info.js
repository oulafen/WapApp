$(document).ready(function () {

    $("input[type=file]").change(function () {
        $('#video_' + this.id + '_local_path').attr('value', $('#' + this.id).val());
    });

    bind_video_img_file_change('video_img_1');
});

function bind_video_img_file_change(id) {
    $("#" + id).change(function () {
        console.log(this.id.split('_'));
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

function delete_loaded_video_img(target) {
    console.log(target.rel.split('_'))
    var video_img_id = _(target.rel.split('_')).last();
    $("#video_post_tips")
        .removeClass('post-error')
        .addClass('post-tip')
        .html('正在删除中......');
    $.ajax({
        method: 'POST',
        url: '/admins/delete_video_img',
        data: {video_img_id: Number(video_img_id)},
        error: function () {
            $("#video_post_tips")
                .removeClass('post-tip')
                .addClass('post-error')
                .html('网络异常！');
        },

        success: function (msg) {
            $("#" + $(target).attr("rel")).detach();
            $("#video_post_tips")
                .removeClass('post-error')
                .addClass('post-tip')
                .html('删除成功！');
        }
    });
}

function update_video() {
    $("#video_form").ajaxSubmit({
        target: "#video_post_tips",
        type: "post",
        dataType: "script",
        beforeSubmit: function (formData, jqForm, options) {
            $("#video_post_tips")
                .removeClass('post-error')
                .addClass('post-tip')
                .html('正在上传数据,请耐心等待...');
            return true;
        },

        success: function (msg) {
            console.log(msg);
            if (msg) {
                $("#video_post_tips")
                    .removeClass('post-error')
                    .addClass('post-tip')
                    .html('上传成功！');
                back_to_videos_manage();
            }
            if(!msg){
                $("#video_post_tips")
                    .removeClass('post-tip')
                    .addClass('post-error')
                    .html('上传失败！')
            }
        },

        error: function () {
            $("#video_post_tips")
                .removeClass('post-tip')
                .addClass('post-error')
                .html('网络异常！');
        }
    });
}

function back_to_videos_manage() {
    var back_data = {status: 1, back_id: 'all_videos'};
    save_back_data(back_data);
    parent.window.location = '/admins/index';
}