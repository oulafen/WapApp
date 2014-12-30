class App < ActiveRecord::Base

  after_save :reindex_solr
  after_destroy :reindex_solr
  attr_accessible :name,:id ,:cdkey ,:activity ,:category_index_id,:category_detail_id,:apk_link,:iphone_link,:video_link,:price,:introduce,:ipa_key,:ipa_name,:ipa_size,:ipa_type,:logo,:apk_key,:apk_name,:apk_size,:apk_type


  has_attached_file :logo,
                    :url  => "/images/apps/logos/:id/:basename.:extension",
                    :path => ":rails_root/public/images/apps/logos/:id/:basename.:extension"
  validates_attachment_content_type :logo, :content_type => ['image/jpeg', 'image/png','image/gif']

  searchable do
    text :name
  end

  def reindex_solr
    App.reindex
  end
end
