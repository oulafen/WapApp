class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :name
      t.integer :views, :default => 0
      t.string :position
      t.string :video_link
      t.string :list_img
      t.string :cover
      t.text :intro
      t.string :video_img
      t.string :list_img_local_path
      t.string :cover_local_path

      t.timestamps
    end
  end
end
