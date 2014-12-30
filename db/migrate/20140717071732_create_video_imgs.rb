class CreateVideoImgs < ActiveRecord::Migration
  def change
    create_table :video_imgs do |t|
      t.string :img
      t.integer :video_id
      t.string  :video_img_local_path
      t.timestamps
    end
  end
end
