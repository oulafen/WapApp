class GiftPack < ActiveRecord::Base
  attr_accessible :name, :app_id, :amount, :gift_pack_type, :deduct_integral, :applicable_time, :detail, :card_nums

end