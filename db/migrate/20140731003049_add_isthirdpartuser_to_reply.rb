class AddIsthirdpartuserToReply < ActiveRecord::Migration
  def change
    add_column :replies, :is_third_part_user, :boolean
  end
end
