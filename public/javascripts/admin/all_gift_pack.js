$(window).ready(function(){
    $("#loaderModal").modal('hide');
    $('#gift_pack_excel_btn').click(function(){
        $('#gift_pack_excel_input').click();
    });

    $("#gift_pack_excel_input").change(function(event){
        var file_name = event.target.files[0].name;
        var file_type = file_name.split('.')[1];
        if(file_type=='xls' || file_type=='xlsx'){
            $('#loaderModal').modal('show');
            $("#submit_excel").click();
        }else{
            alert('请上传格式为 .xls 或 .xlsx 的表格文件');
        }
    })
});