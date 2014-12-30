class ThirdPartyUsersController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def new_third_party_user
    user=ThirdPartyUser.new(name:params[:name],from:params[:from],head:params[:head],third_party_id:params[:third_party_id])
    if user.save
      render json:user
    else
      user = ThirdPartyUser.where(name:params[:name],from:params[:from],head:params[:head],third_party_id:params[:third_party_id]).take
      render json:user
    end


  end

  def check_weixin_data
    render json:params[:echostr]
  end
end