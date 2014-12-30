class AdsController < ApplicationController

  skip_before_filter :verify_authenticity_token

  def fetch_ads_data
    render :json => {:ads => Ad.where(:position => params[:position]).sort_by { |ad| ad[:index]}}
  end

end
