class Message < ActiveRecord::Base
  def render_data
    {
        id:self.id,
        sender: User.where(id:self.sender).take.render_struct,
        title: self.title,
        content: self.content,
        item_id: self.item_id,
        msg_type: self.msg_type,
        created_at:self.created_at
    }
  end

  def self.create_message_for_user(sender, receiver, title, content, item_id, msg_type)
    message = self.new
    message.sender = sender
    message.to_user = receiver
    message.title = title
    message.content = content
    message.item_id = item_id
    message.msg_type = msg_type
    message.save
  end
end
