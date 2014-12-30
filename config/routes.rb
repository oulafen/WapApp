FingerBangWebApp::Application.routes.draw do

  resources :feedbacks

  resources :messages

  get "ads/fetch_ads_data"
  get "search/index"
  resources :replies

  resources :topics
  get "/topics_about_me" => "topics#personal_topics"
  post "/reply_to_topic" => "topics#reply_to_me"

  root "www#redirect"

  scope "/index" do
    get "/" => "www#index"
    get "/index.html" => "www#index"
    get "/pages/:page_name.html" => "www#page"
  end

  scope "/users" do
    post "/create" => 'users#create'
    post "/login" => 'users#login'
    post "/save_login_user" => 'users#save_login_user'
    post "/reset_password" => 'users#reset_password'
    post "/update_logo" => 'users#update_logo'
    post "/update_nickname" => 'users#update_nickname'
    post "/update_user_logo" => "users#update_user_logo"
    post "/forget_password" => "users#forget_password"
    post "/get_user_by_code" => "users#get_user_by_code"

    get "/fetch_info" => "users#user_info"
  end

  scope '/admins' do
    get '/login' => 'admins#login'
    get '/index' => 'admins#index'
    get '/all_admins' => 'admins#show_all_admins'
    get '/all_editors' => 'admins#show_all_editors'
    get '/all_users' => 'admins#show_all_users'
    get '/all_apps' => 'admins#show_all_apps'
    get '/new_admin' => 'admins#add_new_admin'
    get '/admin_info' => 'admins#modify_admin_info'
    get '/new_editor' => 'admins#add_new_editor'
    get '/editor_info' => 'admins#modify_editor_info'
    get '/new_app' => 'admins#add_new_app'
    get '/app_info' => 'admins#app_info'
    get '/app_basic_info' => 'admins#show_app_basic_info'
    get '/all_gift_packs' => 'admins#show_all_gift_packs'
    get '/add_gift_pack' => 'admins#add_gift_pack'
    get '/gift_pack_detail' => 'admins#show_gift_pack_detail'
    get '/down_gift_pack_excel_file' => 'admins#down_gift_pack_excel_file'
    get '/ads_position_manage/:position'  => 'admins#ads_position_manage'
    get '/videos_manage' => 'admins#videos_manage'
    get '/new_video' => 'admins#add_new_video'
    get '/video_details_info/:id' =>'admins#video_details_info'
    get '/video_info' => 'admins#video_info'
    get '/strategies'=>'admins#show_strategies'
    get '/strategy'=>'admins#add_new_strategy'
    get '/strategy_detail'=>'admins#show_strategy_detail'
    get "/bbs_manage" => "admins#manage_topics"
    get '/new_topic' => "admins#admin_new_topic"
    get '/manage_topic_replies' => 'admins#mange_topic_replies'
    get '/third_party_users'=>'admins#show_third_party_users'
    get '/all_activities' => 'admins#show_all_activities'
    get '/new_activity' => 'admins#add_new_activity'
    get '/activity_detail' => 'admins#show_activity_detail'
    get "/apps/:app_id/comments_manage" => 'admins#app_comments_manage'
    get "/videos/:video_id/comments_manage" => 'admins#video_comments_manage'
    get "/system_messages" => "admins#system_messages"
    get "/new_sys_msg" => "admins#new_sys_msg"

    post "/new_sys_msg" => "admins#post_new_sys_msg"
    post '/login_session' => 'admins#process_login'
    post '/new_admin_session' => 'admins#new_admin_session'
    post '/modify_admin_info_session' => 'admins#modify_admin_info_session'
    post '/new_app' => 'admins#new_app_session'
    post '/new_app_data' => 'admins#process_new_app_data'
    post '/app_basic_info' => 'admins#process_modify_app_info'
    post '/all_gift_packs' => 'admins#process_gift_pack_excel'
    post '/app_photo' => 'admins#process_app_photo'
    post '/save_gift_pack' => 'admins#save_gift_pack'
    post '/new_apk'=>'admins#process_new_apk'
    post '/new_ipa'=>'admins#process_new_ipa'
    post '/update_gift_pack' => 'admins#update_gift_pack'
    post '/uploader_ads' => 'admins#uploader_ads'
    post '/delete_ad_img' => 'admins#delete_ad_img'
    post '/create_video' => 'admins#create_video'
    post '/update_video_info' => 'admins#update_video_info'
    post '/delete_video_img' => 'admins#delete_video_img'
    post '/strategy'=>'admins#process_strategy_info'
    post '/strategy_detail'=>'admins#modify_strategy_info'
    post '/new_topic' => "admins#admin_create_topic"
    post '/admin_reply_to_topic' => "admins#admin_reply_to_topic"
    post '/reply_to_app' => "admins#admin_reply_to_app"
    post '/reply_to_video' => "admins#admin_reply_to_video"
    post '/save_activity' => "admins#save_activity"
    post '/update_activity' => "admins#update_activity"

    delete '/logout' => 'admins#logout'
    delete '/delete_admin_session' => 'admins#delete_admin_session'
    delete '/delete_user' => 'admins#delete_user'
    delete '/app_session' => 'admins#delete_app_session'
    delete '/delete_gift_pack' => 'admins#delete_gift_pack'
    delete '/delete_video_session' => 'admins#delete_video'
    delete '/strategy'=>'admins#delete_strategy'
    delete '/delete_activity'=>'admins#delete_activity'
  end

  scope "/videos" do
    post "/reply" => "videos#reply_to_me"
  end
  #process_data
  get '/weixin_data'=>'third_party_users#check_weixin_data'
  get '/tencent_callback'=>'third_party_users#tencent_callback'


  post '/app_data' => 'apps#get_apps_data'
  post '/back_this_app' => 'apps#get_app_data'
  post '/get_app_photo'=>'apps#get_app_photo'
  post '/back_download_info'=>'apps#get_download_info'
  post '/judge_download_status'=>'apps#get_download_status'
  post '/add_integral'=>'apps#add_integral'
  post '/back_current_download_apps'=>'apps#get_current_download_apps'
  post '/back_strategy_info'=>'apps#back_strategy_info'
  post '/back_strategy_detail'=>'apps#get_strategy_detail'
  post '/add_strategy_view_num'=>'apps#add_strategy_view_num'
  post '/add_video_views'=>'videos#add_video_views'
  post '/add_topic_view_num'=>'topics#add_topic_view_num'
  post '/back_reply_num'=>'activities#back_reply_num'

  post '/third_party_user'=>'third_party_users#new_third_party_user'

  post '/back_app_gift_packs' => 'apps#get_app_gift_packs_data'
  post '/back_app_activities' => 'apps#get_app_activities_data'
  post '/back_one_gift_pack' => 'apps#get_one_gift_pack_data'
  post '/back_one_activity' => 'apps#get_one_activity_data'
  post '/back_app_gift_pack_status' => 'apps#get_app_gift_pack_status'
  post '/back_app_activity_status' => 'apps#get_app_activity_status'
  post '/apps_list_data' => 'apps#get_apps_list_data'

  post '/back_all_gift_packs_activities' => 'gift_packs#fetch_all_gift_packs_activities_data'
  post '/back_my_gift_packs' => 'gift_packs#fetch_my_gift_packs_data'
  post '/user_fetch_gift_pack' => 'gift_packs#user_fetch_gift_pack'
  post '/back_has_fetched_gift_pack' => 'gift_packs#get_filter_gift_pack'
  post '/back_no_fetched_gift_pack' => 'gift_packs#get_filter_gift_pack'
  post '/back_fetched_over_gift_pack' => 'gift_packs#get_filter_gift_pack'

  post '/user_join_activity' => 'activities#user_join_activity'
  post '/back_my_activities' => 'activities#fetch_my_activities_data'
  post '/back_no_joined_activity' => 'activities#get_filter_activity'
  post '/back_has_joined_activity' => 'activities#get_filter_activity'
  post '/back_overdue_activity' => 'activities#get_filter_activity'

  post '/ads_data' => 'ads#fetch_ads_data'

  post '/videos_data' => 'videos#fetch_videos_data'
  post '/back_this_video' => 'videos#fetch_video'
  post '/videos_list_data' => 'videos#fetch_videos_list_data'

  resources :app_names

  post '/apps/reply' => "apps#reply_to_me"

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
