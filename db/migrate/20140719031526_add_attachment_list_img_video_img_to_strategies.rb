class AddAttachmentListImgVideoImgToStrategies < ActiveRecord::Migration
  def self.up
    change_table :strategies do |t|
      t.attachment :list_img
      t.attachment :video_img
    end
  end

  def self.down
    drop_attached_file :strategies, :list_img
    drop_attached_file :strategies, :video_img
  end
end
