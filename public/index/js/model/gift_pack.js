function GiftPack() {

}

GiftPack.get_one_card_num = function (card_nums) {
    var card_nums_array = card_nums.replace('，',',').split(',');
    var card_num = card_nums_array.shift();
    var card_nums_string = card_nums_array.toString();

    return {'card_num': card_num, 'card_nums_string': card_nums_string}
};


