class ChangeTypeFieldForReply < ActiveRecord::Migration
  def change
    rename_column :replies,:type ,:item_type
  end
end
