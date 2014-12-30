class AddAppIdToStrategies < ActiveRecord::Migration
  def change
    add_column :strategies ,:app_id,:integer
  end
end
