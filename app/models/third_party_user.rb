class ThirdPartyUser < ActiveRecord::Base
  attr_accessible :name ,:from,:head,:third_party_id
  before_save :unique_check?

  def render_struct
    {
        nickname:self.name,
        logo:self.head
    }
  end

  private
    def unique_check?
      return ThirdPartyUser.where(from:from,third_party_id:third_party_id).take.nil?
    end
end
