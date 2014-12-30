class AppCategory < ActiveRecord::Base

  attr_accessible :name
  has_many :app_category_details, dependent: :destroy
end
