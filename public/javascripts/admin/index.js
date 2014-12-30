$(document).ready(function(){
    var back_id =  get_back_id();
    if(back_id){
        document.getElementById(back_id).click();
        clear_back_data();
    }
});

function get_back_id(){
    var back_data = JSON.parse(localStorage.getItem('back_data'));
    if(back_data){
        return back_data.back_id;
    }
    if(!back_data){
        return false;
    }
}

function clear_back_data() {
    localStorage.removeItem('back_data');
}