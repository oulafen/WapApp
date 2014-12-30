$(window).ready(function(){
    set_deduct_integral_status();
    set_time_status('activity_time');
    set_activity_type_status();
    set_permanent_btn_change();
});

function set_activity_type_status(){
    var activity_type = $("#activity_type_select").attr('rel');
    if (activity_type){
        setSelected($("#activity_type_select")[0],activity_type);
    }
}