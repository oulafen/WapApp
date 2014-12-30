class RemoveColumnFromApps < ActiveRecord::Migration
  def change
    remove_column :apps ,:apk
    remove_column :apps ,:ipa
  end
end
