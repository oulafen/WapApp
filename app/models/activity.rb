class Activity < ActiveRecord::Base
  attr_accessible :name, :app_id, :activity_type, :deduct_integral, :activity_time, :detail

end