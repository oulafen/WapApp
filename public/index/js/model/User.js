function User(nickname, password, password_confirmation, mailbox) {
    this.nickname = nickname;
    this.password = password;
    this.password_confirmation = password_confirmation;
    this.mailbox = mailbox;
    this.logo = JSON.parse(localStorage.getItem('crop_logo_data'));
    this.integral = 2000;
}

User.save = function (user) {
    localStorage.setItem('user', JSON.stringify(user))
};

User.prototype.create = function () {
    var third_party_user=JSON.parse(localStorage.getItem("third_party_user"));
    if(third_party_user){
        if(third_party_user['from']=='腾讯微博'){
            var tencent_weibo=third_party_user['third_party_id'];
        }
        if(third_party_user['from']=='新浪微博'){
            var sina_weibo=third_party_user['third_party_id']
        }
        if(third_party_user['from']=='微信'){
            var weixin=third_party_user['third_party_id']
        }
        var third_head=third_party_user['head']
    }
    var self = this,
        is_legal = self.judge_user_info(),
        post_data = {'user': {'nickname': self.nickname, 'password': self.password, 'password_confirmation': self.password_confirmation,
            'logo': self.logo, 'mailbox': self.mailbox, 'integral': self.integral,'tencent_weibo':tencent_weibo,'sina_weibo':sina_weibo,'weixin':weixin},"third_head":third_head};
    if (is_legal) {
        $.ajax({
            type: "POST",
            url: "/users/create.json",
            data: post_data
        }).done(function (data) {
                if (data.status == 0) {
                    show_error('*该邮箱已存在');
                    return;
                }
                if (data.status == 1) {
                    var user = {'nickname': self.nickname, 'mailbox': self.mailbox, 'logo': self.logo, 'integral': 2000};
                    if (!self.logo){
                        user['logo']=third_head;
                    }
                    User.save(user);
                    hide_error();
//                    localStorage.removeItem("third_party_user")
                    window.location = '/index/#/home';
                }
            });
    }

};

User.prototype.judge_user_info = function () {
    if (!this.nickname || !this.password || !this.password_confirmation) {
        show_error('*请将信息填写完整');
        return false;
    }
    if (this.password != this.password_confirmation) {
        show_error('*两次密码输入不一致');
        return false;
    }
    if (!this.mailbox) {
        show_error('*请填入正确的邮箱地址');
        return false;
    }
    if (this.password.length < 6) {
        show_error('*请输入6-12位的密码');
        return false;
    }

    return true;
};

User.prototype.login = function () {
    var self = this;
    var is_input_legal = User.judge_login_input(self.mailbox, self.password);

    if (is_input_legal) {
        $.ajax({
            type: "POST",
            url: "/users/login.json",
            data: {'mailbox': this.mailbox, 'password': this.password}
        }).done(function (data) {
                if (data.status == 'not_regist') {
                    show_error('*该邮箱未注册');
                    localStorage.setItem('login_status','0');
                    return;
                }
                if (data.status == 'password_error') {
                    show_error('*用户名或密码错误');
                    localStorage.setItem('login_status','0');
                    return;
                }
                if (data.status == 'login_success') {
                    User.save(data.user);
                    hide_error();
                    localStorage.setItem('login_status','1');
                    var current_url = localStorage.getItem('current_url');
                    if(current_url == "/login"){
                        window.location = '/index/#/home';
                    }
                    localStorage.removeItem('current_url');
                }
            });
    }
};

User.get_login_info_status = function(){
    return localStorage.getItem('login_status')==1 ? true : false;
};

User.get = function () {
    return JSON.parse(localStorage.getItem('user'));
};

User.logout = function () {
    User.clear_user();
    User.clear_logo();
    localStorage.removeItem("third_party_user")
    localStorage.removeItem('login_status');
};

User.reset_password = function (password, confirmation_password) {
    var is_legal = User.judge_reset_password_input(password, confirmation_password);
    if (is_legal) {
        $.ajax({
            type: "POST",
            url: "/users/reset_password",
            data: {'user': {'mailbox': User.get().mailbox, 'password': password}}
        }).done(function (data) {
                if (data.status == 1) {
                    hide_error();
                    window.location = '/index/#/home';
                }
            });
    }
};

User.judge_mailbox = function (mailbox) {
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    return reg.test(mailbox)
};

User.judge_login_input = function (mailbox, password) {
    if (!mailbox) {
        show_error('*请填入正确的注册邮箱地址');
        return false;
    }
    if (!mailbox || !password) {
        show_error('*输入不能为空');
        return false;
    }
    return true;
};

User.judge_reset_password_input = function (password, confirmation_password) {
    if (!password || !confirmation_password) {
        show_error('*密码输入不能为空');
        return false;
    }
    if (password != confirmation_password) {
        show_error('*两次密码输入不一致');
        return false;
    }
    if (password.length < 6) {
        show_error('*请输入6-12位的密码');
        return false;
    }
    return true;
}

User.get_logo = function () {
    return JSON.parse(localStorage.getItem('crop_logo_data'));
};

User.clear_user = function () {
    localStorage.removeItem('user');
};

User.clear_logo = function () {
    localStorage.removeItem('logo_data');
    localStorage.removeItem('crop_logo_data');
};

User.clear_current_url = function () {
    localStorage.removeItem('current_url');
};

User.update_user_logo = function () {
    var logo = User.get_logo(),
        user = User.get();
    if (logo) {
        $.ajax({
            type: "POST",
            url: "/users/update_logo",
            data: {'mailbox': user.mailbox, 'logo': logo}
        }).done(function (data) {
                if (data.status == 1) {
                    User.save(data.user);
                    User.clear_logo();
                }
                if(data.status == 0){
//                    alert(data.error)
                }
            });
    }
};

User.update_nickname = function () {
    var nickname = $('#nickname').val(),
        user = User.get();
    $.ajax({
        type: "POST",
        url: "/users/update_nickname",
        data: {'mailbox': user.mailbox, 'nickname': nickname}
    }).done(function (data) {
            if (data.status == 1) {
                User.save(data.user);
                console.log('update nickname success')
            }
        });

};

User.save_current_url = function (url) {
    localStorage.setItem('current_url', url);
};

User.get_current_url = function(){
    return localStorage.getItem('current_url');
}

User.get_nicknames = function () {
    return JSON.parse(localStorage.getItem('nickname')) || [];
};

User.save_nickname = function (nicknames) {
    localStorage.setItem('nickname', JSON.stringify(nicknames));

};
User.get_current_user = function () {
    return localStorage.user == undefined ? {mailbox:null} : JSON.parse(localStorage.user);
}

User.is_login  = function(){
    return localStorage.user == undefined ? false : true;
}

User.save_regist_temp_data = function(nickname,password,password_confirmation,mailbox){
    localStorage.setItem('regist_temp_data',JSON.stringify({nickname:nickname,password:password,password_confirmation:password_confirmation,mailbox:mailbox}));
};

User.get_regist_temp_data = function(){
    return JSON.parse(localStorage.getItem('regist_temp_data'));
};

User.clear_regist_temp_data = function(){
    localStorage.removeItem('regist_temp_data');
};

User.get_user_for_sub_topic = function(){
    if(User.is_login()){
        return User.get();
    }
    if(User.is_user_third_login()){
        return User.get_third_user();
    }
    return {
        is_third_part_user:false,
        mailbox:null
    };
}

User.is_user_third_login = function(){
    return localStorage.getItem("third_party_user") != undefined;
}

User.get_third_user = function(){
    third_user = JSON.parse(localStorage.getItem("third_party_user"));
    return {
        third_party_id : third_user.third_party_id,
        is_third_part_user:true
    }
}

function show_error(error_info) {
    $("#error_info").html(error_info);
    $("#error").removeClass('hide');
}

function hide_error() {
    $("#error").addClass('hide');
}