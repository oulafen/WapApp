class ModifyTypeToGiftPackTypeInTableGiftPack < ActiveRecord::Migration
  def change
    rename_column :gift_packs, :type, :gift_pack_type
  end
end
