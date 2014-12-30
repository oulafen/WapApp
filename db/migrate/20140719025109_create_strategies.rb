class CreateStrategies < ActiveRecord::Migration
  def change
    create_table :strategies do |t|
      t.string :name
      t.integer :view_num
      t.string :video_link
      t.text :detail_content

      t.timestamps
    end
  end
end
