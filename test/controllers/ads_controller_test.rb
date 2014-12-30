require 'test_helper'

class AdsControllerTest < ActionController::TestCase
  test "should get fetch_ads_data" do
    get :fetch_ads_data
    assert_response :success
  end

end
