class AddAttachmentPhotoToAppPhotos < ActiveRecord::Migration
  def self.up
    change_table :app_photos do |t|
      t.attachment :photo
    end
  end

  def self.down
    drop_attached_file :app_photos, :photo
  end
end
