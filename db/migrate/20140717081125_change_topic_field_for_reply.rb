class ChangeTopicFieldForReply < ActiveRecord::Migration
  def change
    rename_column :replies,:topic ,:item
  end
end
