class AddAttachmentIpaToApps < ActiveRecord::Migration
  def self.up
    change_table :apps do |t|
      t.attachment :ipa
    end
  end

  def self.down
    drop_attached_file :apps, :ipa
  end
end
