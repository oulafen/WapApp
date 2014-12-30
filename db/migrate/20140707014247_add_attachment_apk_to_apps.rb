class AddAttachmentApkToApps < ActiveRecord::Migration
  def self.up
    change_table :apps do |t|
      t.attachment :apk
    end
  end

  def self.down
    drop_attached_file :apps, :apk
  end
end
