class Emailcheck < ActiveRecord::Base
  validates :code , uniqueness: true
end
