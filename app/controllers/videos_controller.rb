class VideosController < ApplicationController
  skip_before_filter :verify_authenticity_token
  require 'will_paginate/array'

  def fetch_videos_data
    videos = Video.order('created_at DESC').where(is_recommend:true).first(16)
    videos.each do |video|
      video.intro = video.intro.gsub('&nbsp;',' ').gsub("<br>","\r\n")
    end
    render :json => {:videos => videos}
  end

  def fetch_video
    @video = Video.find(params[:id])
    render :json => {:video => @video, :video_imgs => @video.video_imgs}
  end

  def fetch_videos_list_data
    @videos = Video.all(:conditions => ['position LIKE ?', '%' + params[:type] + '%']).reverse.paginate :page => params[:page], :per_page => 12
    videos=[]
    @videos.each do |video|
      temp_video = {:id=>video[:id],:name=>video[:name],:views=>video[:views],:position=>video[:position],:video_link=>video[:video_link],
      :list_img=>{'url'=>video.list_img.url},:cover=>video[:cover],:intro=>video[:intro].gsub('&nbsp;',' ').gsub("<br>","\r\n"),:video_img=>video[:video_img],:list_img_local_path=>video[:list_img_local_path],
      :cover_local_path=>video[:cover_local_path],:created_at=>video[:created_at].to_s[0..9],:all_length=>Video.all(:conditions => ['position LIKE ?', '%' + params[:type] + '%']).length}
      videos.push(temp_video)
    end

    render :json => {:data => videos}
  end

  def add_video_views
    video=Video.find_by(id:params[:id])
    video[:views]=video[:views] +1
    video.save
    render json:'true'
  end

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
end
