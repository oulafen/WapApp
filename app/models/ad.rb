class Ad < ActiveRecord::Base
  attr_accessible :image, :describe, :ad_link, :image_local_path
  mount_uploader :image, PictureUploader

  def update_ad_img_info(params, index)
    self.update({:image => params['image_' + index.to_s],
                    :image_local_path => params['image_local_path_' + index.to_s],
                    :describe => params['describe_' + index.to_s],
                    :ad_link => params['ad_link_' + index.to_s]
                   })
  end

  def self.create_ad(params, index)
    @ad = Ad.new()
    # @ad.id               = index
    @ad.image            = params['image_' + index.to_s]
    @ad.describe         = params['describe_' + index.to_s]
    @ad.ad_link          = params['ad_link_' + index.to_s]
    @ad.image_local_path = params['image_local_path_' + index.to_s]
    @ad.index            = index
    @ad.position         = params[:position]
    return @ad.save
  end

  def self.is_ad_img_exist(params, index)
    @tmp_ad = Ad.find_by(:index => index, :position => params[:position])

     return @tmp_ad && (@tmp_ad.image_local_path != params['image_local_path_' + index.to_s] ||
                        @tmp_ad.describe != params['describe_' + index.to_s] ||
                        @tmp_ad.ad_link  != params['ad_link_' + index.to_s])
  end

end
