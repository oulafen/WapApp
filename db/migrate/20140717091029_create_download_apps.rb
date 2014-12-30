class CreateDownloadApps < ActiveRecord::Migration
  def change
    create_table :download_apps do |t|
      t.string :user_mailbox
      t.integer :app_id

      t.timestamps
    end
  end
end
