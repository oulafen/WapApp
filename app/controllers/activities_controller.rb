class ActivitiesController < ApplicationController
  skip_before_filter :verify_authenticity_token
  require 'will_paginate/array'

  def fetch_my_activities_data
    activities = []

    if !params[:mailbox].nil?
      tmp_activities = UserActivity.order('created_at desc').where(:user_id => User.find_by(:mailbox => params[:mailbox]).id)
      tmp_activities.each do |tmp_activity|
        app = App.find_by(:id => tmp_activity[:app_id])
        active = Activity.find_by(:id => tmp_activity.activity_id)
        activity = {:id => active[:id], :app_id => app.id, :app_logo => app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url,
                    :name => active[:name], :activity_type => active[:activity_type],:created_at=>active[:created_at].to_s[0..9],
                    :activity_time=>active[:activity_time]}
        activities.push(activity)
      end
    end

    render json: {'data' => activities.sort{ |x, y| y[:created_at] <=> x[:created_at] }}
  end

  def back_reply_num
    reply_num=Reply.find_reply_info_for_item('App', params[:id])[:total_number]
    if !reply_num
      reply_num=0
    end
    render json:{'data'=>reply_num}
  end


  def user_join_activity
    activity = Activity.find_by(:id => params[:activity_id])

    user = User.find_by(:mailbox => params[:mailbox])
    user.integral = Integer(user.integral) - Integer(activity.deduct_integral)
    user.save

    UserActivity.create({:user_id => user.id, :activity_id => params[:activity_id], :app_id => params[:app_id]})

    render json: {'status' => 1, 'user' => {'nickname' => user[:nickname], 'mailbox' => user[:mailbox], 'logo' => user.logo.url=="/logos/original/missing.png" ? user.third_logo : user.logo.url, 'integral' => user[:integral]}}
  end

  def get_filter_activity
    tmp_activities = Activity.order('created_at desc')

    activities = []
    user_joined_status = 0
    overdue_status = 0

    tmp_activities.each do |tmp_activity|
      app = App.find_by(:id => tmp_activity[:app_id])
      activity_end_time = tmp_activity[:activity_time] == '永久' ? 'forever' : tmp_activity[:activity_time].split(/至/)[1]
      if activity_end_time != 'forever'
        overdue_status = Date.parse(activity_end_time).to_s < Date.today.to_s ? 1 : 0
      end
      if !params[:mailbox].nil?
        user_joined_status = UserActivity.find_by(:user_id => User.find_by(:mailbox => params[:mailbox]).id, :activity_id => tmp_activity.id).nil? ? 0 : 1
      end

      if params[:filter] == 'no_joined' && overdue_status==0 && user_joined_status==0
        activity = {:id => tmp_activity[:id], :name => tmp_activity[:name], :app_id => tmp_activity.app_id,
                    :activity_type => tmp_activity[:activity_type], :activity_time => tmp_activity[:activity_time],
                    :app_logo => app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url,
                    :user_joined_status => 0, :overdue_status => 0, :created_at => tmp_activity[:created_at].to_s[0..9]}
        activities.push(activity)
      end

      if params[:filter] == 'has_joined' && overdue_status==0 && user_joined_status==1
        activity = {:id => tmp_activity[:id], :name => tmp_activity[:name], :app_id => tmp_activity.app_id,
                    :activity_type => tmp_activity[:activity_type], :activity_time => tmp_activity[:activity_time],
                    :app_logo => app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url,
                    :user_joined_status => 1, :overdue_status => 0, :created_at => tmp_activity[:created_at].to_s[0..9]}
        activities.push(activity)
      end

      if params[:filter] == 'overdue' && overdue_status==1
        activity = {:id => tmp_activity[:id], :name => tmp_activity[:name], :app_id => tmp_activity.app_id,
                    :activity_type => tmp_activity[:activity_type], :activity_time => tmp_activity[:activity_time],
                    :app_logo => app.logo.url=="/logos/original/missing.png" ? '' : app.logo.url,
                    :overdue_status => 1, :created_at => tmp_activity[:created_at].to_s[0..9]}
        activities.push(activity)
      end
    end

    render json: {'data' => activities}
  end

end