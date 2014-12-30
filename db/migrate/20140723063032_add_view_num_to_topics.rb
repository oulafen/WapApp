class AddViewNumToTopics < ActiveRecord::Migration
  def change
    add_column :topics,:view_num,:integer
  end
end
