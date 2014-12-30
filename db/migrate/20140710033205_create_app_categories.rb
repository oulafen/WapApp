class CreateAppCategories < ActiveRecord::Migration
  def change
    create_table :app_categories do |t|
      t.string :name

      t.timestamps
    end
  end
end
