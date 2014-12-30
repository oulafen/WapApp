function ThirdPartUser(){}

ThirdPartUser.is_login = function(){
    return localStorage.third_party_user != undefined;
}

ThirdPartUser.get_current_user = function(){
    var str_third_party_user = localStorage.third_party_user || "null";
    var user = JSON.parse(str_third_party_user);
    user["type"] = "third_part";
    return user;
}




