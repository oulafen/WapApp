class CreateFeedbacks < ActiveRecord::Migration
  def change
    create_table :feedbacks do |t|
      t.integer :user
      t.string :body

      t.timestamps
    end
  end
end
