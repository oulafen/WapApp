class AddAttachmentLogoToApps < ActiveRecord::Migration
  def self.up
    change_table :apps do |t|
      t.attachment :logo
    end
  end

  def self.down
    drop_attached_file :apps, :logo
  end
end
