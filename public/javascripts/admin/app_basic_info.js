$(document).ready(function(){
    init_app_basic_info();
    show_app_category_details();
    reload_image("logo_overlook","logo_input","show_logo_input");
    reload_apk("apk_overlook","apk_input","show_apk_input");
    console.log("in  basic")
    reload_ipa("ipa_overlook","ipa_input","show_ipa_input");
    init_photo_input();
    localStorage.removeItem("app_photo_id");
    localStorage.removeItem("photo_files");
    localStorage.removeItem("n");
    localStorage.removeItem("delete_photo_num");
    localStorage.removeItem("add_logo");
    localStorage.removeItem("cancle");
    localStorage.removeItem("cancle_ipa");
    load_apk();
    load_ipa();
});