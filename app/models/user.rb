class User < ActiveRecord::Base
  has_secure_password
  validates :mailbox , :presence => true, :uniqueness => {:case_sensitive => false}
  validates :nickname , :presence => true

  attr_accessible :mailbox,:third_logo, :nickname, :password, :password_confirmation, :logo, :integral, :weixin, :sina_weibo, :tencent_weibo

  has_attached_file :logo, :styles => { :small => "512x512>"  },
                    :url  => "/images/users/:id/:style/:basename.:extension",
                    :path => ":rails_root/public/images/users/:id/:style/:basename.:extension"

  #validates_attachment_presence :logo
  validates_attachment_content_type :logo, :content_type => ['image/jpeg', 'image/png','image/gif']

  def self.add_integral_for(user_id,delta)
    user = self.where(id:user_id).take
    if !user[:isadmin] && user[:id] > 0
      user[:integral]+= delta
    end
    user.save
    user[:integral]
  end

  def self.for_admin_sub_topic_user(user_name)
    if user_name.nil? || user_name == ""
      return self.where(id:-1).take
    end

    user = self.where(nickname:user_name,isadmin:true).take

    if !user.nil?
      return user.id
    end

    user = self.new
    user.nickname = user_name
    user.isadmin = true
    user.password = "1"
    user.save(validate: false)
    return user
  end
  def self.find_user(id)
    User.where(id:id)
  end

  def render_struct
    {
        nickname: self.nickname,
        logo: self.get_logo
    }
  end

  def get_logo
    if self.id == 0
      return "img/128.png"
    end
    if self.isadmin || self.id ==-1
      return "img/default_logo_user.png"
    end
    logo = self.logo.url(:small)=="/logos/small/missing.png" ? self.third_logo : self.logo.url(:small)
    logo = logo == nil ? "img/default_logo_user.png" : logo
    logo
  end
end
