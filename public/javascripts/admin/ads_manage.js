$(document).ready(function(){

    $("input[type=file]").change(function () {
        var self = this;
        _(this.files).each(function (file) {
           if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif') {
               show_img_local_path(self.id);
               show_img_preview(file, self.id);
           } else {
               alert('请选择格式为.jpg .png .gif的文件');
           }
        });
    });

    $(".ad-label-btn").click(function () {

    })
});

function show_img_local_path(img_input_file_id) {
    $("#img_local_path_" + img_input_file_id).attr('value', $('#' + img_input_file_id).val());
}

function show_img_preview(file, img_input_file_id) {
    var file_reader = new FileReader();
    file_reader.readAsDataURL(file);
    file_reader.onload = function (event) {
        var img_show_id     = 'show_' + img_input_file_id,
            img_num_content = $('#img_num_' + img_input_file_id).html().replace(/：/, "");

        if ($("#" + img_show_id).length != 0) {
//            return $('#' + img_show_id + '>img').attr('src', event.target.result)
           return $('#' + img_show_id).html("<img class='app_photo_large' name='ad_" + img_input_file_id + "'  src=" + event.target.result + "><a class='app_detail_photo' rel='" + img_show_id + "' onclick='remove_ad_img(this)'>&times</a><p class='text-center img-font'>"+ img_num_content + "</p>");
        }
        $("#img_count").attr('value', Number($("#img_count").val()) + 1);
        $("#photo_reader").append("<div class='col-xs-2' id='" + img_show_id + "'><img class='app_photo_large' name='ad_" + img_input_file_id + "'  src=" + event.target.result + "><a class='close_mark' rel='" + img_show_id + "' onclick='remove_ad_img(this)'>&times</a><p class='text-center img-font'>"+ img_num_content + "</p></div>")
    };
}

function remove_ad_img(target) {
    $("#img_count").attr('value', Number($("#img_count").val()) - 1);
    $("#" + $(target).attr("rel")).html('');
}

function submit_ad_form() {

    $("#ad_form").ajaxSubmit({
        target:"#ad_post_tips",
        type: "post",
        dataType: "script",
        beforeSubmit: function(formData, jqForm, options){
            console.log(arguments);
            document.getElementById("ad_post_tips").innerText='正在上传数据,请耐心等待...';
            return true;
        },

        success: function (msg) {
            console.log(msg);
            if (msg) {
             return document.getElementById("ad_post_tips").innerText = '上传成功！';
            }
            document.getElementById("ad_post_tips").innerText = '上传失败！';
        },

        error: function (msg) {

        }
    });
}

function delete_loaded_ad_img(target) {
    console.log(target.id);
    document.getElementById("ad_post_tips").innerText='正在删除中...';
    $.ajax({
        method: 'POST',
        url: '/admins/delete_ad_img',
        data: {ad_id: Number(target.id)},
        error: function () {

        },

        success: function (msg) {
            console.log(msg);
            remove_ad_img(target);
            document.getElementById("ad_post_tips").innerText='删除成功！';
        }
    });
}

