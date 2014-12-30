class DeleteCardsIdInTableOfGiftPack < ActiveRecord::Migration
  def change
    remove_column :gift_packs, :cards_id
  end
end
