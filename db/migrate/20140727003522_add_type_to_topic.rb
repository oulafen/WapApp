class AddTypeToTopic < ActiveRecord::Migration
  def change
    add_column :topics, :last_replied_at, :datetime
  end
end
