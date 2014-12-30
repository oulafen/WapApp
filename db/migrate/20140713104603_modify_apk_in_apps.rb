class ModifyApkInApps < ActiveRecord::Migration
  def change
    remove_column :apps,:apk_file_name,:string
    remove_column :apps,:apk_content_type,:string
    remove_column :apps,:apk_file_size,:integer
    remove_column :apps,:apk_updated_at,:string
    add_column :apps, :apk_key, :string
    add_column :apps, :apk_name, :string
    add_column :apps, :apk_size, :integer
    add_column :apps, :apk_type, :string
  end
end
