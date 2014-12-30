class UsersController < ApplicationController

  skip_before_filter :verify_authenticity_token, :all

  def create
    is_repeat = !User.find_by(:mailbox => params[:user][:mailbox]).nil?
    if is_repeat
      render json: {status: 0}
    end

    if !is_repeat
      user = User.new(params[:user])
      if params[:third_head] && params[:user][:logo]==''
        user[:third_logo]=params[:third_head]
      end
      user.save
      if params[:user][:tencent_weibo]
        ThirdPartyUser.find_by(from:'腾讯微博',third_party_id:params[:user][:tencent_weibo]).delete
      end
      if params[:user][:sina_weibo]
        ThirdPartyUser.find_by(from:'新浪微博',third_party_id:params[:user][:sina_weibo]).delete
      end
      if params[:user][:weixin]
        ThirdPartyUser.find_by(from:'微信',third_party_id:params[:user][:weixin]).delete
      end
      if user.save
        render json: {status: 1}
      end
    end
  end

  def user_info
    user = User.where(mailbox:params[:mailbox]).take
    user = user user
    respond_to do |format|
      format.json {
        render json:user
      }
    end
  end

  def user(user)
    {
        nickname: user.nickname,
        mailbox: user.mailbox,
        logo: user.logo.url(:small)=="/logos/small/missing.png" ? user.third_logo : user.logo.url(:small),
        integral: user.integral
    }

  end

  def login
    user = User.find_by(:mailbox => params[:mailbox])
    if user.nil?
      respond_to do |format|
        format.json { render json: {status: 'not_regist'} }
      end
    end
    if user && !user.authenticate(params[:password])
      respond_to do |format|
        format.json { render json: {status: 'password_error'}}
      end
    end
    if user && user.authenticate(params[:password])
      respond_to do |format|
        format.json { render json: {status: 'login_success', user: user(user)}}
      end
    end
  end

  def reset_password
    user = User.find_by(:mailbox => params[:user][:mailbox])
    user.password = params[:user][:password]
    user.password_confirmation = params[:user][:password]
    user.save

    if user.save
      render json: {status: 1}
    end
  end

  def update_logo
    user = User.find_by(:mailbox => params[:mailbox])
    user.logo = params[:logo]
    user.save
    if user.save
      p '==========update logo success============='
      render json: {status: 1, user: user(user)}
    end
    if !user.save
      render json: {status: 0,error:user.errors}
    end
  end

  def update_nickname
    user = User.find_by(:mailbox => params[:mailbox])
    user.nickname = params[:nickname]
    user.save
    if user.save
      render json: {status: 1, user: user(user)}
    end
  end

  def update_user_logo
    user = User.find_by(:mailbox => params[:mailbox])
    user.logo = params[:logo]
    user.save
    if user.save
      render json: {status: 1, user: user(user)}
    end
  end

  def forget_password
    user = User.where(mailbox:params[:email]).take
    if user.nil?
      respond_to do |format|
        format.json { render json: {succeed: false}}
      end
      return
    end
    record = Emailcheck.where(email:params[:email]).take
    if record.nil?
      record = Emailcheck.new
      record.email = params[:email]
      saved = false
      while !saved
        record.code = SecureRandom.hex 32
        saved = record.save
      end
    end
    forget_mail = Verify.password_forget_verify_mail record
    result = forget_mail.deliver
    respond_to do |format|
      format.json { render json: {succeed: true}}
    end
  end

  def get_user_by_code
    code = params[:code]
    result = Emailcheck.where(code:code).take
    if result.nil?
      respond_to do |format|
        format.json { render json: {user:nil}}
      end
      return
    end
    selected_user = user User.where(mailbox:result[:email]).take
    result.destroy
    respond_to do |format|
      format.json { render json: {user:selected_user}}
    end
  end

end
