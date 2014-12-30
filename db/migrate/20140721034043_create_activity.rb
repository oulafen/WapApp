class CreateActivity < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.string  :name
      t.integer :app_id
      t.string  :activity_type
      t.string  :deduct_integral
      t.string  :activity_time
      t.string  :detail

      t.timestamps
    end
  end
end
