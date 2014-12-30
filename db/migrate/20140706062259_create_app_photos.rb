class CreateAppPhotos < ActiveRecord::Migration
  def change
    create_table :app_photos do |t|

      t.integer :app_id

      t.timestamps
    end
  end
end
