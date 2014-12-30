class Topic < ActiveRecord::Base
  before_destroy :destroy_auth

  def destroy_auth
    !@admin.nil?
  end
  def self.new_with_params params
    topic = Topic.new()
    topic[:title] = params[:topic][:title]
    topic[:body] = params[:topic][:body]
    topic[:owner] = -1
    topic[:is_third_part_user] = params[:owner][:is_third_part_user]
    if topic[:is_third_part_user]
      topic[:owner] = ThirdPartyUser.where(third_party_id: params[:owner][:third_party_id]).take[:id]
    end
    if params[:owner][:mailbox] != nil
      topic[:owner] = User.where(mailbox: params[:owner][:mailbox]).take[:id]
      User.add_integral_for topic[:owner],200
    end
    topic
  end

  def find_my_owner
    if self.is_third_part_user
      return ThirdPartyUser.where(id:self.owner).take.name
    else
      return User.where(id:self.owner).take.name
    end
  end

  def render_struct_topic
    info = Reply.find_reply_info_for_item("Topic",self.id)
    {
        id:self.id,
        owner:self.is_third_part_user ? ThirdPartyUser.where(id:self.owner).take.render_struct : User.where(id:self.owner).take.render_struct,
        created_at:self.created_at,
        last_replier:info[:last_user],
        title:self.title,
        body:self.body,
        view_num:self.view_num,
        last_replied_at:info[:last_reply_date],
        total_replies_num:info[:total_number]==nil ? 0 :info[:total_number]
    }
  end

  def destroy_with_access(admin)
    @admin = admin
    self.destroy
  end
  private
    def find_last_replier

    end
end
