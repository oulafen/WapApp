class FixTopic < ActiveRecord::Migration
  def change
    remove_column :topics, :last_replied_at
    remove_column :topics, :last_replyer
    remove_column :topics, :total_replies
  end
end
