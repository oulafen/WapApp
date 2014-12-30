class Excel < ActiveRecord::Base
  attr_accessible :excel

  has_attached_file :excel,
                    :url  => "/assets/excels/:id/:style/:basename.:extension",
                    :path => ":rails_root/public/assets/excels/:id/:style/:basename.:extension"

  #validates_attachment_presence :logo
  do_not_validate_attachment_file_type :excel
end
