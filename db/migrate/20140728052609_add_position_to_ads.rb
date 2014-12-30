class AddPositionToAds < ActiveRecord::Migration
  def change
    add_column :ads, :position, :string, :default => 'home'
  end
end
