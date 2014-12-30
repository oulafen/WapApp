class UserGiftPack < ActiveRecord::Base
  attr_accessible :user_id, :gift_pack_id, :app_id, :gift_pack_card_num

end