class AddIsthirdpartuserToTopic < ActiveRecord::Migration
  def change
    add_column :topics, :is_third_part_user, :boolean
  end
end
