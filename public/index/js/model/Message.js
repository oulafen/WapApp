function Message(){}
Message.filter_messages = function(messages){
    var str_read_msg = localStorage.read_sys_msg_list || "[]"
    var read_msg = JSON.parse(str_read_msg);
    return _.filter(messages,function(message){
        return _.find(read_msg,function(iterator){
            return iterator == message.id;
        }) == undefined;
    })
}

Message.set_sys_msg_read = function(msg){
    var str_read_msg = localStorage.read_sys_msg_list || "[]"
    var read_msg = JSON.parse(str_read_msg);
    read_msg.push(msg.id)
    localStorage.read_sys_msg_list = JSON.stringify(read_msg);
}