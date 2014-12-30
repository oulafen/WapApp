class Verify < ActionMailer::Base
  default from: "shockingli@126.com"

  def password_forget_verify_mail(record)
    @record = record
    delivery_options = { user_name: "shockingli",password: "lixiaokang",address: "smtp.126.com"}
    mail to: @record.email , subject: '重置密码'
  end
end
