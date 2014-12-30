class AddThirdLogoToUsers < ActiveRecord::Migration
  def change
    add_column :users ,:third_logo,:string
  end
end
