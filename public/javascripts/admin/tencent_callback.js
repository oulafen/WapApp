$(document).ready(function(){
    T.init({
        appkey: "801527396", // 必选，开发者的appkey
//        callbackurl: "http://192.168.1.6:3000/tencent_callback", // 可选，授权后的回跳页面，默认为当前页面
        synclogin: false, // 可选，是否同步QQ登录态，默认为true。
        pingback: false // 可选，是否发送报告，默认为true。
    });
    alert("-----------in")
    alert("status",T.loginStatus())
    alert("-----------midified")

    T.login(function(loginStatus){
        alert("-----------login")
        getUserInfo();
//        login_btn.style.display = "none"
//        logout_btn.style.display = "inline-block";
    },function(loginError){
                alert(loginError.message);
    });
    function getUserInfo(){
        T.api("/user/info")
            .success(function(response){
                if(response.ret === 0){
                    alert("-----in  api")
                    var html="",imgsrc="",data=response.data;
                    html = '<a class="head_img" href="http://t.qq.com/'+ data.name +'" target="_blank"><img src="'+ imgsrc +'" /></a><span class="logout_right"><a class="nick_text" href="http://t.qq.com/' + data.name +'" target="_blank" title="'+data.nick +'">'+ data.nick +'</a><a class="logout_text" id="logout_text"　href="javascript:void(0);">退出</a></span>';
                    logout_btn.innerHTML = html;
                    var logout_text = document.getElementById("logout_text");
//                        logout();
                    var head=data.head + '/120';
                    $http({
                        method:'POST',
                        url:'/third_party_user',
                        data:{'name':data.nick,"from":'腾讯微博',"third_party_id":data.openid,"head":head}
                    }).success(function(back){
                        localStorage.setItem("third_party_user",JSON.stringify(back));
//                            window.location='/index/#/user/new';
                    });
                }else{
                        alert(response.ret);
                }
            })
            .error(function(code,message){
                    alert(message);
            });
    }






//    T.login(function(loginStatus){
//        alert("-------------in")
//        getUserInfo();
//        login_btn.style.display = "none"
//        logout_btn.style.display = "inline-block";
//    },function(loginError){
////                alert(loginError.message);
//    });
////
////    function getUserInfo(){
//    alert("----------in readiy")
//    T.init({
//        appkey: "801527396", // 必选，开发者的appkey
////        callbackurl: "http://192.168.1.6:3000/tencent_callback", // 可选，授权后的回跳页面，默认为当前页面
//        synclogin: false, // 可选，是否同步QQ登录态，默认为true。
//        pingback: false // 可选，是否发送报告，默认为true。
//    });
//        T.api("/user/info")
//            .success(function(response){
//                if(response.ret === 0){
//                    alert("-------in  api")
//                    var html="",imgsrc="",data=response.data;
//                    html = '<a class="head_img" href="http://t.qq.com/'+ data.name +'" target="_blank"><img src="'+ imgsrc +'" /></a><span class="logout_right"><a class="nick_text" href="http://t.qq.com/' + data.name +'" target="_blank" title="'+data.nick +'">'+ data.nick +'</a><a class="logout_text" id="logout_text"　href="javascript:void(0);">退出</a></span>';
//                    logout_btn.innerHTML = html;
//                    var logout_text = document.getElementById("logout_text");
////                        logout();
//                    var head=data.head + '/120';
//                    $http({
//                        method:'POST',
//                        url:'/third_party_user',
//                        data:{'name':data.nick,"from":'腾讯微博',"third_party_id":data.openid,"head":head}
//                    }).success(function(back){
//                        localStorage.setItem("third_party_user",JSON.stringify(back));
////                            window.location='/index/#/user/new';
//                    });
//                }else{
////                        alert(response.ret);
//                }
//            })
//            .error(function(code,message){
//                    alert(message);
//            });
////    }






//    alert(window.location)
//    var access=window.location.toString().split("#")[1]
//    var href='http://wap.handx2.com/index/#/login#'+access
//    alert('href'+href)
//    window.location=href
})