class Admin < ActiveRecord::Base
  has_secure_password
  attr_accessible :name,:password, :password_confirmation,:login_type
  validates :name,:password,:password_confirmation,:login_type, presence: true
  validates :name, uniqueness: true
end
