class ReAddCardNumsInTableOfGiftPack < ActiveRecord::Migration
  def change
    remove_column :gift_packs, :card_nums
    add_column :gift_packs, :card_nums, :string
  end
end
