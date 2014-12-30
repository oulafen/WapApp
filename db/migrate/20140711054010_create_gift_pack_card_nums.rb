class CreateGiftPackCardNums < ActiveRecord::Migration
  def change
    create_table :gift_pack_card_nums do |t|
      t.integer :gift_pack_id
      t.string  :card_num

      t.timestamps
    end
  end
end
