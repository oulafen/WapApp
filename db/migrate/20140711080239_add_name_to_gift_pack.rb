class AddNameToGiftPack < ActiveRecord::Migration
  def change
    add_column :gift_packs, :name, :string
  end
end
