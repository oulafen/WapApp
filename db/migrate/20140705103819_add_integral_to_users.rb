class AddIntegralToUsers < ActiveRecord::Migration
  def change
    add_column :users, :integral, :integer, :default=>2000
  end
end
