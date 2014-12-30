class GiftPacksController < ApplicationController
  skip_before_filter :verify_authenticity_token
  require 'will_paginate/array'

  def fetch_all_gift_packs_activities_data
    tmp_gift_packs_activities = (GiftPack.all + Activity.all).sort { |x, y| y[:created_at] <=> x[:created_at] }.paginate :page => params[:page], :per_page => 12

    gift_packs_activities = []
    user_fetched_status = 0
    user_joined_status = 0
    overdue_status = 0

    tmp_gift_packs_activities.each do |tmp_gift_pack_activity|
      app = App.find_by(:id => tmp_gift_pack_activity[:app_id])

      if !tmp_gift_pack_activity[:activity_time].nil?
        activity_end_time = tmp_gift_pack_activity[:activity_time] == '永久' ? 'forever' : tmp_gift_pack_activity[:activity_time].split(/至/)[1]
        if activity_end_time != 'forever'
          overdue_status = Date.parse(activity_end_time).to_s < Date.today.to_s ? 1 : 0
        end
        if !params[:mailbox].nil?
          user_joined_status = UserActivity.find_by(:user_id => User.find_by(:mailbox => params[:mailbox]).id, :activity_id => tmp_gift_pack_activity.id).nil? ? 0 : 1
        end
        activity = {:id => tmp_gift_pack_activity[:id], :name => tmp_gift_pack_activity[:name], :app_id => tmp_gift_pack_activity.app_id,
                    :activity_type => tmp_gift_pack_activity[:activity_type], :activity_time => tmp_gift_pack_activity[:activity_time],
                    :app_logo => app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url,
                    :user_joined_status => user_joined_status, :overdue_status => overdue_status, :created_at => tmp_gift_pack_activity[:created_at].to_s[0..9],
                    :category=>'activity',:all_length=>(GiftPack.all + Activity.all).length}
        gift_packs_activities.push(activity)
      end

      if !tmp_gift_pack_activity[:applicable_time].nil?
        if !params[:mailbox].nil?
          user_fetched_status = UserGiftPack.find_by(:user_id => User.find_by(:mailbox => params[:mailbox]).id, :gift_pack_id => tmp_gift_pack_activity.id).nil? ? 0 : 1
        end
        gift_pack = {:id => tmp_gift_pack_activity[:id], :name => tmp_gift_pack_activity[:name], :amount => tmp_gift_pack_activity[:amount], :app_id => tmp_gift_pack_activity.app_id,
                     :gift_pack_type => tmp_gift_pack_activity[:gift_pack_type], :applicable_time => tmp_gift_pack_activity[:applicable_time],
                     :app_logo => app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url,
                     :user_fetched_status => user_fetched_status, :surplus => tmp_gift_pack_activity[:card_nums].nil? ? 0 : tmp_gift_pack_activity[:card_nums].split(/,|，/).length,
                     :created_at => tmp_gift_pack_activity[:created_at].to_s[0..9],:category=>'gift_pack',:all_length=>(GiftPack.all + Activity.all).length}
        gift_packs_activities.push(gift_pack)
      end
    end
    render json: {'data' => gift_packs_activities}
  end


  def fetch_my_gift_packs_data
    gift_packs = []

    if !params[:mailbox].nil?
      tmp_gift_packs = UserGiftPack.order('created_at desc').where(:user_id => User.find_by(:mailbox => params[:mailbox]).id)
      tmp_gift_packs.each do |tmp_gift_pack|
        app = App.find_by(:id => tmp_gift_pack[:app_id])
        gp = GiftPack.find_by(:id => tmp_gift_pack.gift_pack_id)
        gift_pack = {:id => gp[:id], :app_id => app.id, :app_logo => app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url,
                     :name => gp[:name], :gift_pack_type => gp[:gift_pack_type], :gift_pack_card_num => tmp_gift_pack[:gift_pack_card_num],
                     :created_at=>gp[:created_at].to_s[0..9]}
        gift_packs.push(gift_pack)
      end
    end

    render json: {'data' => gift_packs.sort{ |x, y| y[:created_at] <=> x[:created_at] }}
  end


  def user_fetch_gift_pack
    gift_pack = GiftPack.find_by(:id => params[:gift_pack_id])
    gift_pack.card_nums = params[:current_card_nums]
    gift_pack.save

    user = User.find_by(:mailbox => params[:mailbox])
    user.integral = Integer(user.integral) - Integer(gift_pack.deduct_integral)
    user.save

    UserGiftPack.create({:user_id => user.id, :gift_pack_id => params[:gift_pack_id],
                         :app_id => params[:app_id], :gift_pack_card_num => params[:card_num]})

    render json: {'status' => 1, 'user' => {'nickname' => user[:nickname], 'mailbox' => user[:mailbox], 'logo' => user.logo.url=="/logos/original/missing.png" ? user.third_logo : user.logo.url, 'integral' => user[:integral]}}
  end

  def get_filter_gift_pack
    gift_packs = []
    user_fetched_status = 0
    tmp_gift_packs = GiftPack.order('created_at desc')

    tmp_gift_packs.each do |tmp_gift_pack|
      if !params[:mailbox].nil?
        user_fetched_status = UserGiftPack.find_by(:user_id => User.find_by(:mailbox => params[:mailbox]).id, :gift_pack_id => tmp_gift_pack[:id]).nil? ? 0 : 1
      end
      surplus = tmp_gift_pack[:card_nums].nil? ? 0 : tmp_gift_pack[:card_nums].split(/,|，/).length
      app = App.find_by(:id => tmp_gift_pack[:app_id])

      if params[:filter] == 'has_fetched' && surplus!=0 && user_fetched_status==1
        gift_pack = {:id => tmp_gift_pack[:id], :app_id => app.id, :app_logo => app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url,
                     :name => tmp_gift_pack[:name], :gift_pack_type => tmp_gift_pack[:gift_pack_type], :created_at => tmp_gift_pack[:created_at].to_s[0..9],
                     :amount => tmp_gift_pack[:amount], :applicable_time => tmp_gift_pack[:applicable_time], :user_fetched_status => 1,
                     :surplus => surplus}
        gift_packs.push(gift_pack)
      end

      if params[:filter] == 'no_fetched' && surplus!=0 && user_fetched_status==0
        gift_pack = {:id => tmp_gift_pack[:id], :app_id => app.id, :app_logo => app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url,
                     :name => tmp_gift_pack[:name], :gift_pack_type => tmp_gift_pack[:gift_pack_type], :created_at => tmp_gift_pack[:created_at].to_s[0..9],
                     :amount => tmp_gift_pack[:amount], :applicable_time => tmp_gift_pack[:applicable_time], :user_fetched_status => 0,
                     :surplus => surplus}
        gift_packs.push(gift_pack)
      end

      if params[:filter] == 'fetched_over' && surplus==0
        gift_pack = {:id => tmp_gift_pack[:id], :app_id => app.id, :app_logo => app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url,
                     :name => tmp_gift_pack[:name], :gift_pack_type => tmp_gift_pack[:gift_pack_type], :created_at => tmp_gift_pack[:created_at].to_s[0..9],
                     :amount => tmp_gift_pack[:amount], :applicable_time => tmp_gift_pack[:applicable_time], :user_fetched_status => user_fetched_status,
                     :surplus => 0}
        gift_packs.push(gift_pack)
      end

    end

    render json: {'data' => gift_packs}
  end

end