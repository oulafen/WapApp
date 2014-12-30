class CreateAds < ActiveRecord::Migration
  def change
    create_table :ads do |t|
      t.string :image
      t.text   :describe
      t.string :ad_link
      t.string :image_local_path
      t.integer :index

      t.timestamps
    end
  end
end
