class CreateUserGiftPack < ActiveRecord::Migration
  def change
    create_table :user_gift_packs do |t|
      t.integer :user_id
      t.integer :gift_pack_id
      t.integer :app_id
      t.string  :gift_pack_card_num

      t.timestamps
    end
  end
end
