$(document).ready(function(){
    localStorage.removeItem("list_img_file");
    localStorage.removeItem("video_img_file");
    $("#list_img_file").change(function(e){
        $("#list_img_input").val($("#list_img_file")[0].value.split("\\").pop());
        for (var i = 0; i < e.target.files.length; i++) {
            var file = e.target.files.item(i);
            var freader = new FileReader();
            freader.readAsDataURL(file);

            freader.onload = function (e) {
                localStorage.setItem("list_img_file",e.target.result);
            }
        }
    });
    $("#video_img_file").change(function(e){
        $("#video_img_input").val($("#video_img_file")[0].value.split("\\").pop());
        for (var i = 0; i < e.target.files.length; i++) {
            var file = e.target.files.item(i);
            var freader = new FileReader();
            freader.readAsDataURL(file);

            freader.onload = function (e) {
                localStorage.setItem("video_img_file",e.target.result);
            }
        }
    });
});