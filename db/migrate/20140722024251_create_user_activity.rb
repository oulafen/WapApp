class CreateUserActivity < ActiveRecord::Migration
  def change
    create_table :user_activities do |t|
      t.integer :user_id
      t.integer :gift_pack_id
      t.integer :app_id

      t.timestamps
    end
  end
end
