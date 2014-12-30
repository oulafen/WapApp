class AppCategoryDetail < ActiveRecord::Base
  attr_accessible :name ,:app_category_id
  belongs_to :app_category
end
