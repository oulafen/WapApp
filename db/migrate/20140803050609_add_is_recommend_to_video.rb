class AddIsRecommendToVideo < ActiveRecord::Migration
  def change
    add_column :videos, :is_recommend, :boolean
  end
end
