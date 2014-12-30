class CreateTopics < ActiveRecord::Migration
  def change
    create_table :topics do |t|
      t.string :title
      t.text :body
      t.integer :owner
      t.integer :last_replyer
      t.integer :total_replies

      t.timestamps
    end
  end
end
