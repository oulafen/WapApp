class FixGiftPackIdToActivityIdInTableOfUserActivity < ActiveRecord::Migration
  def change
    rename_column :user_activities,:gift_pack_id ,:activity_id
  end
end
