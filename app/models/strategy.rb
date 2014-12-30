class Strategy < ActiveRecord::Base
  attr_accessible :app_id,:name,:view_num,:video_link,:detail_content,:list_img,:video_img,:app_id

  has_attached_file :list_img,
                    :url  => "/images/strages/list_imgs/:id/:basename.:extension",
                    :path => ":rails_root/public/images/strages/list_imgs/:id/:basename.:extension"
  validates_attachment_content_type :list_img, :content_type => ['image/jpeg', 'image/png','image/gif']

  has_attached_file :video_img,
                    :url  => "/images/strages/video_imgs/:id/:basename.:extension",
                    :path => ":rails_root/public/images/strages/video_imgs/:id/:basename.:extension"
  validates_attachment_content_type :video_img, :content_type => ['image/jpeg', 'image/png','image/gif']
end
