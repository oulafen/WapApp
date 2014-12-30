class FeedBackMailer < ActionMailer::Base
  default from: "shockingli@126.com"

  def feed_back_mail(feed_back)
    @feed_back = feed_back
    delivery_options = { user_name: "shockingli",password: "lixiaokang",address: "smtp.126.com"}
    mail to: 'shockinglee.at@gmail.com', subject: '意见反馈'
  end

end
