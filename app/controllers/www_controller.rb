class WwwController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def page
    render file: File.join(Rails.root.to_s, "public/index/hamls/pages/#{params[:page_name]}")
  end

  def index
    render file: File.join(Rails.root.to_s, "public/index/hamls/index")
  end
  def redirect
    redirect_to "/index/#/"
  end
end