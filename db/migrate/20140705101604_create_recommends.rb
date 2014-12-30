class CreateRecommends < ActiveRecord::Migration
  def change
    create_table :recommends do |t|

      t.string :type
      t.integer :item_id
      t.timestamps
    end
  end
end
