class Reply < ActiveRecord::Base
  before_destroy :destroy_auth

  #require Integer
  def destroy_auth
    !@admin.nil?
  end

  def destroy_with_access(admin)
    @admin = admin
    self.destroy
  end

  def render_struct
    {
        id: self.id,
        replier: self.is_third_part_user ? ThirdPartyUser.where(id: self.replier).take.render_struct : User.where(id: self.replier).take.render_struct,
        created_at: self.created_at,
        reply_body: self.reply_body
    }
  end

  def self.create_reply_for_item(user, reply_body, item_topic_id, type)
    reply = Reply.new()
    reply[:reply_body] = reply_body
    reply[:item] = item_topic_id
    reply[:item_type] = type
    reply[:replier] = -1
    reply[:is_third_part_user] = user[:is_third_part_user]

    if reply[:is_third_part_user]
      reply[:replier] = ThirdPartyUser.where(third_party_id: user[:third_party_id]).take[:id]
    end
    if user[:mailbox] != nil
      reply[:replier] = User.where(mailbox: user[:mailbox]).take[:id]
      User.add_integral_for reply[:replier], 100
    end
    if user[:is_admin]
      reply[:replier] = user[:id]
    end

    if !reply[:is_third_part_user]
      self.send_message_to_others(item_topic_id, type, reply[:replier], reply)
    end
    reply
  end

  def self.find_all_replies_for(item_topic_id, item_type, num)
    if !num.nil?
      return self.order(created_at: :asc).where(item_type: item_type, item: item_topic_id).last(num)
    end
    return self.order(created_at: :asc).where(item_type: item_type, item: item_topic_id)
  end

  def self.find_reply_info_for_item(type, item_id)
    replies = self.order(created_at: :desc).where(item_type: type, item: item_id)
    reply_info = {}
    if replies.length != 0
      reply_info = {
          last_user: replies.first().is_third_part_user ? ThirdPartyUser.where(id: replies.first().replier).take.render_struct : User.where(id: replies.first().replier).take.render_struct,
          last_reply_date: replies.first()[:created_at],
          total_number: replies.length
      }
    end

    reply_info
  end

  private

  def self.send_message_to_others(item_id, item_type, sender, reply)
    if item_type == "Topic"
      self.send_msg_for_reply_to_topic(sender, item_id, reply)
    end
    if item_type == "App"
      self.send_msg_for_reply_to_app(sender, item_id, reply)
    end

    if item_type == "Video"
      self.send_msg_for_reply_to_video(sender, item_id, reply)
    end
  end

  def self.send_msg_for_reply_to_app(sender, item_id, reply)
    sender = User.where(id: sender).take
    repliers= Reply.select(:replier, :is_third_part_user).where(item: item_id, item_type: "App")
    app = App.where(id: item_id).take
    user_ids = []

    repliers.each do |replier|
      if !replier.is_third_part_user
        user_ids.push replier[:replier]
      end
    end

    user_ids = user_ids.uniq
    user_ids.delete sender[:id]
    user_ids.delete -1

    user_ids.each do |user_id|
      Message.create_message_for_user sender.id, user_id, "回复我参与的应用评论:"+app[:name], reply[:reply_body], item_id, "App"
    end
  end

  def self.send_msg_for_reply_to_video(sender, item_id, reply)
    sender = User.where(id: sender).take
    repliers= Reply.select(:replier, :is_third_part_user).where(item: item_id, item_type: "Video")
    app = Video.where(id: item_id).take
    user_ids = []

    repliers.each do |replier|
      if !replier.is_third_part_user
        user_ids.push replier[:replier]
      end
    end

    user_ids = user_ids.uniq
    user_ids.delete sender[:id]
    user_ids.delete -1

    user_ids.each do |user_id|
      Message.create_message_for_user sender.id, user_id, "回复我参与的视频:"+app[:name], reply[:reply_body], item_id, "Video"
    end
  end

  def self.send_msg_for_reply_to_topic(sender, topic_id, reply)
    sender = User.where(id: sender).take
    repliers= Reply.select(:replier, :is_third_part_user).where(item: topic_id, item_type: "Topic")
    topic = Topic.where(id: topic_id).take
    user_ids = []
    repliers.each do |replier|
      if !replier.is_third_part_user
        user_ids.push replier[:replier]
      end
    end
    user_ids = user_ids.uniq
    user_ids.delete sender[:id]
    user_ids.delete -1

    if sender[:id] != topic[:owner] && !topic[:is_third_part_user]
      Message.create_message_for_user sender.id, topic[:owner], "回复我的帖子:"+topic.title, reply[:reply_body], topic_id, "Topic"
    end

    user_ids.each do |user_id|
      Message.create_message_for_user sender.id, user_id, "回复我参与的帖子:"+topic.title, reply[:reply_body], topic_id, "Topic"
    end
  end

end
