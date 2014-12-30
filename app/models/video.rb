class Video < ActiveRecord::Base
  after_save :reindex_solr
  after_destroy :reindex_solr

  has_many :video_imgs, :dependent => :destroy
  accepts_nested_attributes_for :video_imgs

  attr_accessible :name,
                  :views,
                  :position,
                  :video_link,
                  :list_img,
                  :cover,
                  :intro,
                  :video_img,
                  :list_img_local_path,
                  :cover_local_path,
                  :video_imgs_attributes,
                  :is_recommend



  mount_uploader :list_img,  PictureUploader
  mount_uploader :cover,     PictureUploader
  searchable do
    text :name
  end

  def reindex_solr
    Video.reindex
  end
end
