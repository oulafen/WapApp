class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :sender
      t.integer :to_user
      t.string :content
      t.string :title
      t.string :msg_type
      t.integer :item_id

      t.timestamps
    end
  end
end
