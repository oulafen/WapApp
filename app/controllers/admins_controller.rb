require 'will_paginate/array'
class AdminsController < ApplicationController

  skip_before_filter :verify_authenticity_token

  before_action :get_current_admin
  before_filter :admin_is_login, except: [:login, :process_login]

  def get_current_admin
    @admin =Admin.find_by(id: cookies[:admin_id])
  end

  def admin_is_login
    admin =Admin.find_by(id: cookies[:admin_id])
    if !admin
      redirect_to '/admins/login'
    end
  end

  def index
    if @admin[:login_type]=='super_admin'
      @is_super_admin=true
      @is_admin=true
    end
    if @admin[:login_type]=='admin'
      @is_admin=true
    end
  end

  def modify_admin_info
    @modify_admin=Admin.find(params[:id])
  end

  def modify_editor_info
    @modify_admin=Admin.find(params[:id])
  end

  def new_admin_session
    admin=Admin.find_by(name: params[:name])
    if admin
      render json: {:data => 'repeated'}
    else
      Admin.create(name: params[:name], password: params[:password], password_confirmation: params[:password], login_type: params[:admin_type])
      render json: {:data => 'true'}
    end
  end

  def modify_admin_info_session
    admin=Admin.find_by(id: params[:id])
    admin.password=params[:password]
    admin.password_confirmation=params[:password]
    admin.save
    render json: {:data => 'true'}
  end

  def show_all_admins
    @admins=Admin.order("created_at desc").where(:login_type => 'admin').paginate :page => params[:page], :per_page => 30
  end

  def show_all_editors
    @editors=Admin.order("created_at desc").where(:login_type => 'editor').paginate :page => params[:page], :per_page => 30
  end

  def show_all_users
    @users = User.order("created_at desc").where("isadmin is null and id > 0").paginate :page => params[:page], :per_page => 30
  end

  def show_all_apps
    session[:current_app_id] = nil
    @apps_page=App.order("created_at desc").paginate :page => params[:page], :per_page => 30
    tmp_apps=[]
    @apps_page.each do |app|
      tmp_app={}
      tmp_app['id']=app[:id]
      tmp_app['name']=app[:name]
      if app[:category_index_id]
        tmp_app['category']=AppCategory.find_by(id: app[:category_index_id])[:name]
      end
      tmp_app['gift_pack']= !GiftPack.find_by(:app_id => app[:id]).nil?
      tmp_app['activity']= !Activity.find_by(:app_id => app[:id]).nil?
      tmp_app['created_at']=app[:created_at]
      tmp_apps.push(tmp_app)
    end
    @apps=tmp_apps
  end

  def show_strategies
    @app=App.find_by(id: session[:current_app_id])
    @strategies=Strategy.where(:app_id => @app[:id]).order("created_at desc").paginate :page => params[:page], :per_page => 30
  end

  def add_new_strategy
    @app=App.find_by(id: session[:current_app_id])
  end

  def show_strategy_detail
    @strategy=Strategy.find_by(:id => params[:id])
    @app=App.find_by(:id => @strategy[:app_id])
    @detail_content=@strategy[:detail_content]
  end

  def delete_strategy
    Strategy.find_by(:id => params[:id]).delete
    @app=App.find_by(id: session[:current_app_id])
    @strategies=Strategy.where(:app_id => @app[:id]).order("created_at desc").paginate :page => params[:page], :per_page => 30
    render :show_strategies
  end

  def modify_strategy_info
    strategy=Strategy.find_by(id: params[:strategy_id])
    strategy.update_attributes(name: params[:name], video_link: params[:video_link], detail_content: params[:detail_content])
    if params[:fake_list_img]==""
      strategy.list_img=nil
    elsif params[:list_img]!=""
      strategy.list_img=params[:list_img]
      strategy[:list_img_file_name]=params[:fake_list_img]
    end
    if params[:fake_video_img]==""
      strategy.video_img=nil
    elsif params[:video_img]!=""
      strategy.video_img=params[:video_img]
      strategy[:video_img_file_name]=params[:fake_video_img]
    end
    strategy.save
    render json: 'true'
  end

  def process_strategy_info
    if params[:fake_list_img]==""
      params[:list_img]=nil
    end
    if params[:fake_video_img]==""
      params[:video_img]=nil
    end
    strategy=Strategy.new(name: params[:name], video_link: params[:video_link], detail_content: params[:detail_content],
                          list_img: params[:list_img], video_img: params[:video_img], app_id: params[:app_id])
    strategy[:list_img_file_name]=params[:fake_list_img]
    strategy[:video_img_file_name]=params[:fake_video_img]
    strategy.save
    render json: 'true'
  end

  def show_all_gift_packs
    session[:current_gift_pack_id] = nil
    @gift_pack_excel={:excel_sheet => ''}
    @app = App.find_by(id: session[:current_app_id])
    @gift_packs = GiftPack.order('created_at desc').where(app_id: session[:current_app_id]).paginate :page => params[:page], :per_page => 30
  end

  def add_gift_pack
    @gift_pack = GiftPack.new
    @app = App.find_by(id: session[:current_app_id])
  end

  def process_gift_pack_excel
    file = params[:gift_pack_excel][:excel_sheet]
    excel = Excel.create({:excel => file})
    excel_type = File.extname(excel.excel.path)
    if excel_type == ".xlsx"
      sheet = Roo::Excelx.new(excel.excel.path)
    end
    if excel_type == ".xls"
      sheet = Roo::Excel.new(excel.excel.path)
    end
    row_index = 2
    while !sheet.cell(row_index, 1).nil?
      GiftPack.create({:app_id => session[:current_app_id], :name => sheet.cell(row_index, 1), :amount => sheet.cell(row_index, 2), :gift_pack_type => sheet.cell(row_index, 3),
                       :deduct_integral => sheet.cell(row_index, 4), :applicable_time => sheet.cell(row_index, 5),
                       :detail => sheet.cell(row_index, 6), :card_nums => sheet.cell(row_index, 7)})
      row_index += 1
    end
    excel.delete

    redirect_to :controller => 'admins', :action => 'show_all_gift_packs'
  end

  def down_gift_pack_excel_file
    send_file "public/files/上传礼包模版.xls"
  end

  def show_gift_pack_detail
    @app = App.find_by(id: session[:current_app_id])
    @gift_pack = GiftPack.find_by(:id => params[:id])
    session[:current_gift_pack_id] = params[:id]
  end

  def delete_gift_pack
    GiftPack.find_by(id: params[:id]).delete
    UserGiftPack.where(gift_pack_id: params[:id]).delete_all

    redirect_to :controller => 'admins', :action => 'show_all_gift_packs'
  end

  def save_gift_pack
    GiftPack.create({:app_id => session[:current_app_id], :name => params[:name], :amount => params[:amount],
                     :gift_pack_type => params[:gift_pack_type], :deduct_integral => params[:deduct_integral],
                     :applicable_time => params[:applicable_time], :detail => params[:detail], :card_nums => params[:card_nums]})

    render json: {status: 1}
  end

  def update_gift_pack
    gift_pack = GiftPack.find_by(:id => session[:current_gift_pack_id])

    gift_pack[:name] = params[:name]
    gift_pack[:amount] = params[:amount]
    gift_pack[:gift_pack_type] = params[:gift_pack_type]
    gift_pack[:deduct_integral] = params[:deduct_integral]
    gift_pack[:applicable_time] = params[:applicable_time]
    gift_pack[:detail] = params[:detail]
    gift_pack[:card_nums] = params[:card_nums]

    gift_pack.save
    render json: {status: 1}
  end


  def process_app_photo
    if params[:delete_photo_nums] !='false'
      for i in 0...params[:delete_photo_nums].length
        AppPhoto.find_by(:id => params[:delete_photo_nums][i]).delete
      end
    end

    if params[:photo_files]
      params[:photo_files].each do |photo_file|
        AppPhoto.create(:photo => photo_file, :app_id => params[:app_id])
      end
    end

    render json: 'true'
  end

  def show_third_party_users
    @third_party_users = ThirdPartyUser.order("created_at desc").paginate :page => params[:page], :per_page => 30
  end

  def add_new_app
    app_category_details=AppCategoryDetail.all
    @app_category_details=app_category_details.map { |app_category_detail| {'app_category' => AppCategory.find_by(id: app_category_detail[:app_category_id])[:name], 'name' => app_category_detail[:name]} }
    @app_categories= AppCategory.all
    app=App.create()
    id=app[:id] +1
    app.delete
    new_app=App.new(id: id)
    @app=new_app
    @uploadToken=Qiniu::RS.generate_upload_token(:scope => FingerBangWebApp::Application::QINIU_BUCKET)
  end

  def new_app_session
    introduce = params[:app][:introduce].gsub("\r\n", "<br>").gsub(' ', '&nbsp;')
    price=params[:price]
    if price=="1"
      price=params[:price_input]
    end
    if params[:fake_logo_input]!=""
      logo=params[:app][:logo]
    end
    if params[:app_category]!="--请选择类别--"
      category_index_id=AppCategory.find_by(name: params[:app_category])[:id]
    end
    if params[:app_category_detail]!="--请选择类别--"
      category_detail_id=AppCategoryDetail.find_by(name: params[:app_category_detail])[:id]
    end
    app=App.find_by(id: params[:app_id])
    if app
      app.update_attributes(:name => params[:app][:name], :category_detail_id => category_detail_id, :category_index_id => category_index_id, :apk_link => params[:app][:apk_link], :iphone_link => params[:app][:iphone_link], :video_link => params[:app][:video_link], :price => price, :introduce => introduce, :logo => logo)
    else
      app=App.new(id: params[:app_id], :name => params[:app][:name], :category_detail_id => category_detail_id, :category_index_id => category_index_id, :apk_link => params[:app][:apk_link], :iphone_link => params[:app][:iphone_link], :video_link => params[:app][:video_link], :price => price, :introduce => introduce, :logo => logo)
    end

    if params[:fake_apk_input]==""
      app[:apk_key]=nil
      app[:apk_name]=nil
      app[:apk_type]=nil
      app[:apk_size]=nil
    end
    if params[:fake_ipa_input]==""
      app[:ipa_key]=nil
      app[:ipa_name]=nil
      app[:ipa_type]=nil
      app[:ipa_size]=nil
    end

    if app.save
      if params[:recommend]
        Recommend.create(:show_type => 'app', :item_id => app[:id])
      end
      apps=App.all.reverse
      tmp_apps=[]
      apps.each do |app|
        tmp_app={}
        tmp_app['id']=app[:id]
        tmp_app['name']=app[:name]
        if app[:category_index_id]
          tmp_app['category']=AppCategory.find_by(id: app[:category_index_id])[:name]
        end
        tmp_app['cdkey']=app[:cdkey]
        tmp_app['activity']=app[:activity]
        tmp_app['updated_at']=app[:updated_at]
        tmp_apps.push(tmp_app)
      end
      @apps=tmp_apps
      redirect_to :all_apps
    else
      render :add_new_app
    end
  end


  def process_modify_app_info
    introduce = params[:app][:introduce].gsub("\r\n", "<br>").gsub(' ', '&nbsp;')
    price=params[:price]
    if price=="1"
      price=params[:price_input]
    end
    if params[:app_category]!="--请选择类别--"
      category_index_id=AppCategory.find_by(name: params[:app_category])[:id]
    end
    if params[:app_category_detail]!="--请选择类别--"
      category_detail_id=AppCategoryDetail.find_by(name: params[:app_category_detail])[:id]
    end
    app=App.find_by(id: params[:app][:id])
    if params[:recommend] && !Recommend.find_by(show_type: 'app', item_id: params[:app][:id])
      Recommend.create(:show_type => 'app', :item_id => app[:id])
    end
    app.update_attributes(:name => params[:app][:name], :category_detail_id => category_detail_id, :category_index_id => category_index_id, :apk_link => params[:app][:apk_link], :iphone_link => params[:app][:iphone_link], :video_link => params[:app][:video_link], :price => price, :introduce => introduce)
    if params[:fake_logo_input]==""
      app.logo=nil
    elsif params[:app][:logo]
      app.logo=params[:app][:logo]
    end
    if params[:fake_apk_input]==""
      app[:apk_key]=nil
      app[:apk_name]=nil
      app[:apk_type]=nil
      app[:apk_size]=nil
    end
    if  params[:fake_ipa_input]==""
      app[:ipa_key]=nil
      app[:ipa_name]=nil
      app[:ipa_type]=nil
      app[:ipa_size]=nil
    end
    app.save
    @app=app
    redirect_to :controller => 'admins', :action => 'show_app_basic_info'

  end

  def delete_app_session
    App.find_by(id: params[:id]).delete
    Recommend.find_by(show_type: 'app', item_id: params[:id])
    AppPhoto.where(:app_id => params[:id]).delete_all
    GiftPack.where(:app_id => params[:id]).delete_all
    Activity.where(:app_id => params[:id]).delete_all
    UserActivity.where(:app_id => params[:id]).delete_all
    UserGiftPack.where(:app_id => params[:id]).delete_all

    redirect_to :all_apps
  end

  def process_new_app_data

  end

  def app_info
    session[:current_app_id] = params[:id]
    @app_id = params[:id]
  end


  def app_comments_manage
    @app_id = params[:app_id]
    @replies = Reply.where(item: params[:app_id], item_type: "App").paginate :page => params[:page], :per_page => 30
    @users = {}
    @replies.each do |reply|
      if !@users.include? reply[:replier]
        @users[reply[:replier]] = User.where(id: reply[:replier]).take
      end
    end
  end

  def show_app_basic_info
    recommend=Recommend.find_by(show_type: 'app', item_id: session[:current_app_id])
    if recommend
      @recommend='recommend'
    else
      @recommend='not_recommend'
    end
    @app=App.find_by(id: session[:current_app_id])
    @app.introduce = @app.introduce.gsub('&nbsp;', ' ').gsub("<br>", "\n\r")
    @logo=@app[:logo_file_name]
    if @app[:category_index_id]
      category=AppCategory.find_by(id: @app[:category_index_id])[:name]
    end
    if @app[:category_detail_id]
      category_detail=AppCategoryDetail.find_by(id: @app[:category_detail_id])[:name]
    end
    @app_category=category
    @app_category_detail=category_detail
    @apk=@app[:apk_name]
    @ipa=@app[:ipa_name]
    if @app[:price].nil?
      @price='空'
    else
      @price=@app[:price]
    end
    app_category_details=AppCategoryDetail.all
    @app_category_details=app_category_details.map { |app_category_detail| {'app_category' => AppCategory.find_by(id: app_category_detail[:app_category_id])[:name], 'name' => app_category_detail[:name]} }
    @app_categories= AppCategory.all
    @photo_files=AppPhoto.where(:app_id => @app[:id])
    @uploadToken=Qiniu::RS.generate_upload_token(:scope => FingerBangWebApp::Application::QINIU_BUCKET)

  end

  def logout
    cookies.delete :admin_id
    redirect_to :controller => 'admins', :action => 'login'
  end

  def delete_admin_session
    Admin.find_by(id: params[:id]).delete
    if params[:admin_type]=='admin'
      redirect_to :all_admins
    end
    if params[:admin_type]=='editor'
      redirect_to :all_editors
    end
  end

  def delete_user
    User.find_by(id: params[:id]).delete
    UserGiftPack.where(:user_id => params[:id]).delete_all
    UserActivity.where(:user_id => params[:id]).delete_all
    redirect_to :all_users
  end

  def login
    if cookies[:admin_id]
      redirect_to :controller => 'admins', :action => 'index'
    end
  end

  def process_login
    admin=Admin.find_by(name: params[:name])
    if admin && admin.authenticate(params[:password])
      cookies.permanent[:admin_id]=admin[:id]
      render json: {:data => 'true'}
    else
      render json: {:data => 'not_find'}
    end
  end

  def process_new_apk
    app=App.find_by(id: params[:id])
    if !app
      app=App.create(id: params[:id])
    end
    app[:apk_key]='http://fingerbang.qiniudn.com/' + params[:apk_key]
    app[:apk_name]=params[:apk_name]
    app[:apk_type]=params[:apk_type]
    app[:apk_size]=params[:apk_size]
    app.save
    render json: 'true'
  end

  def process_new_ipa
    app=App.find_by(id: params[:id])
    if !app
      app=App.create(id: params[:id])
    end
    app[:ipa_key]='http://fingerbang.qiniudn.com/' + params[:ipa_key]
    app[:ipa_name]=params[:ipa_name]
    app[:ipa_type]=params[:ipa_type]
    app[:ipa_size]=params[:ipa_size]
    app.save
    render json: 'true'
  end

  def ads_position_manage
    if params[:position] == 'home'
      @header_title = '首页'
    end
    if params[:position] == 'gift'
      @header_title = '礼包'
    end
    if params[:position] == 'pop'
      session[:ad_position] = 'pop'
      @header_title = '弹窗'
    end
    @ad_cn_num = ['一', '二', '三', '四', '五']
    @ads = Ad.where(:position => params[:position]).sort_by { |ad| ad[:index] }
    params[:img_count] = @ads.length
    @ads.each do |ad|
      params['describe_' + ad.index.to_s] = ad.describe
      params['ad_link_' + ad.index.to_s] = ad.ad_link
      params['image_local_path_' + ad.index.to_s] = ad.image_local_path
      params[:ad_img_id] = ad.id
    end
  end

  def uploader_ads
    @save_error = []
    if session[:ad_position] == 'pop'
      @img_count = 1
    end
    if session[:ad_position] != 'pop'
      @img_count = Integer(params[:img_count]) > 5 ? Integer(params[:img_count]) : 5
    end

    for index in 0...@img_count
      @tmp_ad = Ad.find_by(:index => index, :position => params[:position])
      if Ad.is_ad_img_exist(params, index)
        @tmp_ad.update_ad_img_info(params, index)
      end

      if !@tmp_ad && !params['image_' + index.to_s].kind_of?(String)
        if !Ad.create_ad(params, index)
          @save_error.push(index)
        end
      end
    end
    session[:ad_position] = nil
    respond_to do |format|
      if @save_error.length != 0
        return format.json { render :json => false }
      end
      format.json { render :json => true }
    end
  end

  def delete_ad_img
    respond_to do |format|
      Ad.destroy(params[:ad_id])
      format.json { render :json => true }
    end
  end


  def videos_manage
    @videos = Video.order('created_at desc').paginate :page => params[:page], :per_page => 30
  end

  def add_new_video
    @video = Video.new()
  end

  def create_video
    params[:video][:video_imgs_attributes].map! { |item| item unless item[:img].kind_of?(String) }.compact!
    params[:video][:position] = params[:video][:position].join('，') unless params[:video][:position].nil?
    params[:video][:intro] = params[:video][:intro].gsub("\r\n", "<br>").gsub(' ', '&nbsp;')
    params[:video][:is_recommend] = params[:video][:is_recommend]
    @video = Video.new(params[:video])
    respond_to do |format|
      if @video.save
        format.json { render :json => true }
      else
        format.json { render :json => false }
      end
    end
  end


  def video_details_info
    session[:video_id] = params[:id]
    @video_id = params[:id]
  end

  def delete_video
    Video.destroy(params[:id])
    redirect_to :controller => 'admins', :action => 'videos_manage'
  end

  def video_info
    @video = Video.find(session[:video_id])
    @video.intro = @video.intro.gsub('&nbsp;', ' ').gsub("<br>", "\r\n")
  end

  def update_video_info
    params[:video][:video_imgs_attributes].map! { |item| item unless item[:img].kind_of?(String) }.compact!
    params[:video][:position] = params[:video][:position].join('，') unless params[:video][:position].nil?
    params[:video][:intro] = params[:video][:intro].gsub("\r\n", "<br>").gsub(' ', '&nbsp;')
    p params
    @video = Video.find(session[:video_id])
    respond_to do |format|
      if @video.update(params[:video])
        format.json { render :json => true }
      else
        format.json { render :json => false }
      end
    end

  end

  def delete_video_img
    respond_to do |format|
      VideoImg.destroy(params[:video_img_id])
      format.json { render :json => true }
    end
  end

  def manage_topics
    topics = Topic.order("created_at DESC")
    @topics = []
    topics.each do |topic|
      @topics.push topic.render_struct_topic
    end

    @topics = @topics.paginate :page => params[:page], :per_page => 30
  end

  def admin_new_topic
    @topic = Topic.new
  end

  def admin_create_topic
    as_user = User.for_admin_sub_topic_user params[:user_name]
    title = params[:title]
    content = params[:content]
    topic = Topic.new
    topic[:title] = title
    topic[:body] = content
    topic[:owner] = as_user.id
    topic.save
    respond_to do |format|
      format.html { redirect_to "/admins/bbs_manage" }
    end
  end

  def mange_topic_replies
    @topic = Topic.where(id: params[:topic]).take
    if @topic.nil?
      respond_to do |format|
        format.html { redirect_to "/admins/bbs_manage" }
      end
      return
    end
    @replies = Reply.order("created_at desc").where(item: @topic[:id], item_type: "Topic").paginate :page => params[:page], :per_page => 30
    @users = {}
    @users[@topic[:owner]] = User.where(id: @topic[:owner]).take
    @replies.each do |reply|
      if !@users.include? reply[:replier]
        @users[reply[:replier]] = User.where(id: reply[:replier]).take
      end
    end
  end

  def admin_reply_to_topic
    as_user = User.for_admin_sub_topic_user params[:user_name]
    content = params[:content]
    topic_id = params[:topic]
    user = {
        id:as_user[:id],
        is_third_part_user:false,
        is_admin:as_user.isadmin
    }
    reply = Reply.create_reply_for_item(user, content, topic_id, "Topic")
    reply.save
    respond_to do |format|
      format.html { redirect_to :back }
    end
  end

  def admin_reply_to_app
    as_user = User.for_admin_sub_topic_user params[:user_name]
    content = params[:content]
    app_id = params[:app]
    user = {
        id:as_user[:id],
        is_third_part_user:false,
        is_admin:as_user.isadmin
    }
    reply = Reply.create_reply_for_item(user, content, app_id, "App")

    reply.save
    respond_to do |format|
      format.html { redirect_to :back }
    end
  end

  def show_all_activities
    session[:current_activity_id] = nil
    @app = App.find_by(id: session[:current_app_id])
    @activities = Activity.order('created_at desc').where(app_id: session[:current_app_id]).paginate :page => params[:page], :per_page => 30
  end

  def add_new_activity
    @activity = Activity.new
    @app = App.find_by(id: session[:current_app_id])
  end

  def save_activity
    Activity.create({:app_id => session[:current_app_id], :name => params[:name],
                     :activity_type => params[:activity_type], :deduct_integral => params[:deduct_integral],
                     :activity_time => params[:activity_time], :detail => params[:detail]})

    render json: {'status' => 1}
  end

  def show_activity_detail
    session[:current_activity_id] = params[:id]
    @activity = Activity.find_by(:id => params[:id])
    @app = App.find_by(id: session[:current_app_id])
  end

  def delete_activity
    Activity.find_by(id: params[:id]).delete
    UserActivity.where(activity_id: params[:id]).delete_all

    redirect_to :controller => 'admins', :action => 'show_all_activities'
  end

  def update_activity
    activity = Activity.find_by(:id => session[:current_activity_id])

    activity[:name] = params[:name]
    activity[:activity_type] = params[:activity_type]
    activity[:deduct_integral] = params[:deduct_integral]
    activity[:activity_time] = params[:activity_time]
    activity[:detail] = params[:detail]

    activity.save
    render json: {status: 1}
  end

  def video_comments_manage
    @video_id = params[:video_id]
    @replies = Reply.where(item: params[:video_id], item_type: "Video").paginate :page => params[:page], :per_page => 30
    @users = {}
    @replies.each do |reply|
      if !@users.include? reply[:replier]
        @users[reply[:replier]] = User.where(id: reply[:replier]).take
      end
    end
  end

  def admin_reply_to_video
    as_user = User.for_admin_sub_topic_user params[:user_name]
    content = params[:content]
    video_id = params[:video]
    reply = Reply.create_reply_for_item(as_user, content, video_id, "Video")

    reply.save
    respond_to do |format|
      format.html { redirect_to :back }
    end
  end

  def system_messages
    @sys_messages = Message.where(msg_type: "System").paginate :page => params[:page], :per_page => 30
  end

  def new_sys_message

  end

  def post_new_sys_msg
    msg = Message.new
    msg[:title] = params[:title]
    msg[:sender] = 0
    msg[:content] = params[:content]
    msg[:to_user] = params[:to_user]
    msg[:msg_type] = "System"
    msg.save
    respond_to do |format|
      format.html { redirect_to "/admins/system_messages" }
    end
  end
end
