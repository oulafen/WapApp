class RenameTypeInRecommends < ActiveRecord::Migration
  def change
    rename_column :recommends ,:type,:show_type
  end
end
