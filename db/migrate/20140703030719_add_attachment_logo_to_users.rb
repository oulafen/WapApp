class AddAttachmentLogoToUsers < ActiveRecord::Migration
  def change
    add_attachment :users, :logo
  end
end
