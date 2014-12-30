class VideoImg < ActiveRecord::Base
  attr_accessible :img, :video_id
  belongs_to :video

  mount_uploader :img, PictureUploader
end
