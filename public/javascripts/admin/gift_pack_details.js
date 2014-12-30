$(window).ready(function(){
    set_deduct_integral_status();
    set_time_status('applicable_time');
    set_gift_pack_type_status();
    set_permanent_btn_change();
});

function set_gift_pack_type_status(){
    var gift_pack_type = $("#gift_packs_select").attr('rel');
    if (gift_pack_type){
       setSelected($("#gift_packs_select")[0],gift_pack_type);
    }
}