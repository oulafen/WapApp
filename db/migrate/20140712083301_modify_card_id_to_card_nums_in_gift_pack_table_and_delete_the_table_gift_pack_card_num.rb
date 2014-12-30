class ModifyCardIdToCardNumsInGiftPackTableAndDeleteTheTableGiftPackCardNum < ActiveRecord::Migration
  def change
    remove_column :gift_packs, :card_id
    add_column :gift_packs, :card_nums, :string

    drop_table :gift_pack_card_nums
  end
end
