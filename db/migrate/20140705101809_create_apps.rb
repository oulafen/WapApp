class CreateApps < ActiveRecord::Migration
  def change
    create_table :apps do |t|

      t.string :name
      t.integer :cdkey
      t.integer :activity
      t.integer :category_index_id
      t.integer :category_detail_id
      t.string :apk_link
      t.string :iphone_link
      t.string :apk
      t.string :ipa
      t.string :video_link
      t.integer :price
      t.string :introduce
      t.timestamps
    end
  end
end
