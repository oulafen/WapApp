class AppPhoto < ActiveRecord::Base
  attr_accessible :photo,:app_id
  has_attached_file :photo,
                    :url  => "/images/apps/logos/photos/:id/:basename.:extension",
                    :path => ":rails_root/public/images/apps/logos/photos/:id/:basename.:extension"
  validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/png','image/gif']
end
