class CreateReplies < ActiveRecord::Migration
  def change
    create_table :replies do |t|
      t.integer :replier
      t.integer :topic
      t.text :reply_body

      t.timestamps
    end
  end
end
