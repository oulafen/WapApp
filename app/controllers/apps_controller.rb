class AppsController < ApplicationController
  skip_before_filter :verify_authenticity_token
  require 'will_paginate/array'
  require 'date'

  def reply_to_me
    @reply = Reply.create_reply_for_item(params[:replier],params[:reply_body], params[:item_id],params[:item_type])
    respond_to do |format|
      if @reply.save
        format.json { render json: @reply }
      else
        format.json { render json: @reply.errors, status: :unprocessable_entity }
      end
    end
  end

  def get_apps_data
    apps=App.all.reverse
    tmp_apps=[]
    apps.each do |app|
      if app.logo
        logo=app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url
      end
      num=DownloadApp.where(:app_id=>app[:id]).length
      tmp_app={"download_num"=>num,"id"=>app[:id],"name"=>app[:name],"logo"=>logo,"price"=>app[:price],"video_link"=>app[:video_link]}
      tmp_apps.push(tmp_app)
    end
    render json:{:data=>tmp_apps}
  end

  def get_current_download_apps
    user_mailbox=User.find_by(mailbox:params[:user_mailbox])[:mailbox]
    download_apps=DownloadApp.where(:user_mailbox=>user_mailbox)
    back_data=download_apps.map do |download_app|
      app=App.find_by(id:download_app[:app_id])
      if app.logo
        logo=app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url
      end
      tmp_app={"id"=>app[:id],"name"=>app[:name],"logo"=>logo,"price"=>app[:price],"video_link"=>app[:video_link],"downloads"=>DownloadApp.where(:app_id=>app[:id]).length,"replies"=>Reply.find_reply_info_for_item("App",app[:id])[:total_number]}
      tmp_app
    end
    render json: {'data'=>back_data}
  end

  def get_app_data
    app=App.find_by(id:params[:id])
    if app.logo
      logo=app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url
    end
    tmp_app={:cdkey=>app[:cdkey],:activity=>app[:activity],:video_link=>app[:video_link],:introduce=>app[:introduce]}
    tmp_app[:id]=app[:id]
    tmp_app[:logo]=logo
    tmp_app[:name]=app[:name]
    tmp_app[:download_num]=DownloadApp.where(:app_id=>app[:id]).length
    tmp_app[:price]=app[:price]
    tmp_app[:apk_link]=app[:apk_link]
    tmp_app[:iphone_link]=app[:iphone_link]
    if !app[:category_detail_id].nil?
      category_detail=AppCategoryDetail.find_by(id:app[:category_detail_id])[:name]
    end
    tmp_app[:category_detail]=category_detail
    render json:{'data'=>tmp_app}
  end

  def get_download_status
    download_app=DownloadApp.find_by(user_mailbox:params[:user_mailbox],app_id:params[:app_id])
    if download_app
      render json:{'status'=>'true'}
    else
      DownloadApp.create(user_mailbox:params[:user_mailbox],app_id:params[:app_id])
      user=User.find_by(mailbox:params[:user_mailbox])
      user[:integral]=user[:integral] + 200
      user.save
      render json:{'status'=>'false'}
    end
  end

  def add_strategy_view_num
    strategy=Strategy.find_by(:id=>params[:id])
    if strategy
      if !strategy[:view_num]
        strategy[:view_num]=0
      end
      strategy[:view_num]=strategy[:view_num]+1
      strategy.save
      render json:'true'
    else
      render json:'true'
    end
  end

  def get_download_info
    app=App.find_by(id:params[:app_id])
    if app[:apk_key]
      apk_url=app[:apk_key]
      apk_status='true'
    elsif app[:apk_link] && app[:apk_link]!=""
      apk_url=app[:apk_link]
      apk_status='true'
    else
      apk_url='not_find'
      apk_status='false'
    end
    if app[:iphone_link] && app[:iphone_link]!=""
      ipa_url=app[:iphone_link]
      ipa_status='true'
    else
      ipa_url='not_find'
      ipa_status='false'
    end
    render json:{'apk_url'=>apk_url,"apk_status"=>apk_status,'ipa_url'=>ipa_url,"ipa_status"=>ipa_status}
  end

  def get_app_gift_packs_data
    temp_gift_packs = GiftPack.order('created_at desc').where(:app_id=>params[:app_id]).paginate :page => params[:page], :per_page => 12
    user_fetched_status = 0
    gift_packs = []
    temp_gift_packs.each do |temp_gift_pack|
      if !params[:mailbox].nil?
        user_fetched_status = UserGiftPack.find_by(:user_id=>User.find_by(:mailbox=>params[:mailbox]).id,:gift_pack_id=>temp_gift_pack.id).nil? ? 0 : 1
      end

      gift_pack = {:id=>temp_gift_pack[:id],:name=>temp_gift_pack[:name],:amount=>temp_gift_pack[:amount],:gift_pack_type=>temp_gift_pack[:gift_pack_type],
      :deduct_integral=>temp_gift_pack[:deduct_integral],:applicable_time=>temp_gift_pack[:applicable_time],
      :detail=>temp_gift_pack[:detail],:card_nums=>temp_gift_pack[:card_nums],:user_fetched_status=>user_fetched_status,
      :surplus=>temp_gift_pack[:card_nums].nil? ? 0 : temp_gift_pack[:card_nums].split(/,|，/).length,
      :created_at=>temp_gift_pack[:created_at].to_s[0..9],:all_length=>GiftPack.where(:app_id=>params[:app_id]).length}
    gift_packs.push(gift_pack)
    end

    render json:{'data'=>gift_packs}
  end

  def get_app_activities_data
    temp_activities = Activity.order('created_at desc').where(:app_id=>params[:app_id]).paginate :page => params[:page], :per_page => 12
    user_joined_status = 0
    overdue_status = 0
    activities = []
    temp_activities.each do |temp_activity|
      activity_end_time = temp_activity[:activity_time] == '永久' ? 'forever' : temp_activity[:activity_time].split(/至/)[1]
      if activity_end_time != 'forever'
        overdue_status = Date.parse(activity_end_time).to_s < Date.today.to_s ? 1 : 0
      end

      if !params[:mailbox].nil?
        user_joined_status = UserActivity.find_by(:user_id=>User.find_by(:mailbox=>params[:mailbox]).id,:activity_id=>temp_activity.id).nil? ? 0 : 1
      end

      activity = {:id=>temp_activity[:id],:name=>temp_activity[:name],:activity_type=>temp_activity[:activity_type],
      :deduct_integral=>temp_activity[:deduct_integral],:activity_time=>temp_activity[:activity_time],
      :detail=>temp_activity[:detail],:user_joined_status=>user_joined_status,:overdue_status=>overdue_status,
      :created_at=>temp_activity[:created_at].to_s[0..9],:all_length=>Activity.where(:app_id=>params[:app_id]).length}
    activities.push(activity)
    end

    render json:{'data'=>activities}
  end

  def get_one_gift_pack_data
    gift_pack = GiftPack.find_by(:id=>params[:id])
    user_fetched_status = 0
    if !params[:mailbox].nil?
      user_fetched_status = UserGiftPack.find_by(:user_id=>User.find_by(:mailbox=>params[:mailbox]).id,
                                                 :gift_pack_id=>params[:id]).nil? ? 0 : 1
    end

    render json:{'data'=>{:id=>gift_pack[:id],:name=>gift_pack[:name],:amount=>gift_pack[:amount],
    :gift_pack_type=>gift_pack[:gift_pack_type],:deduct_integral=>gift_pack[:deduct_integral],:applicable_time=>gift_pack[:applicable_time],
    :detail=>gift_pack[:detail],:card_nums=>gift_pack[:card_nums],:user_fetched_status=>user_fetched_status,
    :surplus=>gift_pack[:card_nums].nil? ? 0 : gift_pack[:card_nums].split(/,|，/).length}}

  end

  def get_one_activity_data
    activity = Activity.find_by(:id=>params[:id])
    user_joined_status = 0
    overdue_status = 0
    activity_end_time = activity[:activity_time] == '永久' ? 'forever' : activity[:activity_time].split(/至/)[1]

    if !params[:mailbox].nil?
      user_joined_status = UserActivity.find_by(:user_id=>User.find_by(:mailbox=>params[:mailbox]).id,:activity_id=>activity.id).nil? ? 0 : 1
    end
    if activity_end_time != 'forever'
      overdue_status = Date.parse(activity_end_time).to_s < Date.today.to_s ? 1 : 0
    end
    render json:{'data'=>{:id=>activity[:id],:name=>activity[:name],:activity_type=>activity[:activity_type],
    :deduct_integral=>activity[:deduct_integral],:activity_time=>activity[:activity_time],
    :detail=>activity[:detail],:user_joined_status=>user_joined_status,:overdue_status=>overdue_status}}

  end

  def get_app_gift_pack_status
    gift_pack = GiftPack.find_by(:app_id=>params[:app_id])
    if !gift_pack.nil?
      render json:{status:1}
    end
    if gift_pack.nil?
      render json:{status:0}
    end
  end

  def get_app_activity_status
    activity = Activity.find_by(:app_id=>params[:app_id])
    if !activity.nil?
      render json:{status:1}
    end
    if activity.nil?
      render json:{status:0}
    end
  end

  def back_strategy_info
    strategies=Strategy.where(:app_id=>params[:app_id])
    text_strategies=Strategy.where(:app_id=>params[:app_id],:video_link=>'')
    text_strategies.map do |text_strategy|
      if text_strategy[:view_num]==nil
        text_strategy[:view_num]=0
      end
    end
    videos=strategies - text_strategies
    video_strategies=videos.map do |video|
      if video[:view_num]==nil
        video[:view_num]=0
      end
      video[:list_img_file_name]=video.list_img.url
      video
    end
    render json:{'text_strategy'=>text_strategies,"video_strategy"=>video_strategies}
  end

  def get_strategy_detail
    strategy=Strategy.find_by(id:params[:id])
    strategy[:list_img_file_name]=strategy.list_img.url
    strategy[:video_img_file_name]=strategy.video_img.url
    render json:{'strategy'=>strategy}
  end

  def get_app_photo
    app_photos=AppPhoto.where(:app_id=>params[:id])
    app_urls=[]
    app_photos.each do |app_photo|
      url=app_photo.photo.url
      app_urls.push(url)
    end
    render json:{'data'=>app_urls}
  end

  def get_apps_list_data
    app_category_id = AppCategory.find_by(:name=>params[:type]).id
    apps = App.order('created_at desc').where(:category_index_id=>app_category_id).paginate :page => params[:page], :per_page => 12
    tmp_apps=[]
    apps.each do |app|
      if app.logo
        logo=app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url
      end
      reply_num=Reply.find_reply_info_for_item('App',app[:id])[:total_number]
      if !reply_num
        reply_num=0
      end
      num=DownloadApp.where(:app_id=>app[:id]).length
      tmp_app={:introduce=>app[:introduce].gsub('&nbsp;',' ').gsub("<br>","\r\n"),:reply_num=>reply_num,"download_num"=>num,"id"=>app[:id],"name"=>app[:name],"logo"=>logo,"price"=>app[:price],
               "video_link"=>app[:video_link],:created_at=>app[:created_at].to_s[0..9],:all_length=>App.where(:category_index_id=>app_category_id).length}
      tmp_apps.push(tmp_app)
    end
    render :json => {:data => tmp_apps}
  end
end