class CreateAppCategoryDetails < ActiveRecord::Migration
  def change
    create_table :app_category_details do |t|
      t.belongs_to :app_category
      t.string :name

      t.timestamps
    end
  end
end
