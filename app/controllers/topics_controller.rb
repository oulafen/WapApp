require 'will_paginate/array'

class TopicsController < ApplicationController
  before_action :set_topic, only: [:show, :edit, :update, :destroy]
  skip_before_filter :verify_authenticity_token

  # GET /topics
  # GET /topics.json
  def index
    topics = Topic.all.order("created_at asc")
    @users = []
    @topics = []
    topics.each do |topic|
      @topics.push topic.render_struct_topic
    end
    #p @topics[0]
    @topics.sort! { |item_a,item_b|
      date_a = find_early_date item_a
      date_b = find_early_date item_b
      primary= date_b <=> date_a
      secondary =  item_b[:created_at] <=> item_a[:created_at]
      primary.zero? ? secondary : primary
    }
    @topics = @topics.paginate :page => params[:page], :per_page => 20
  end

  def find_early_date item
    if item[:last_replied_at].nil?
      return item[:created_at]
    end
    return item[:last_replied_at] > item[:created_at] ? item[:last_replied_at] : item[:created_at]
  end

  def personal_topics
    user = User.select(:id).where(mailbox:params[:owner]).take
    owned_topics = Topic.where(owner: user.id,is_third_part_user:false)
    replied_topics = find_my_replied_topics user
    @topics = []
    owned_topics.each do |topic|
      if !topic.nil?
        @topics.push topic.render_struct_topic
      end
    end
    replied_topics.each do |topic|
      if !@topics.include?topic && !topic.nil?
        @topics.push topic.render_struct_topic
      end
    end
  end

  def reply_to_me
    #user_id = params[:replier]==nil ? -1 : User.select(:id).where(mailbox:params[:replier][:mailbox]).take
    @reply = Reply.create_reply_for_item(params[:replier],params[:reply_body], params[:item_id],params[:item_type])
    topic = Topic.where(id:params[:item_id]).take
    respond_to do |format|
      if @reply.save
        format.json { render json: @reply }
      else
        format.json { render json: @reply.errors, status: :unprocessable_entity }
      end
    end
  end

  def find_my_replied_topics(user_id)
    my_replies = Reply.select(:item).where(replier:user_id,item_type:"Topic")
    ids = []
    my_replies.each do |my_reply|
      if !ids.include?my_reply[:item]
          ids.push my_reply[:item]
      end
    end

    replied_topics = []
    ids.each do |reply|
      replied_topics.push Topic.where(id:reply).take
    end
    replied_topics
  end

  # GET /topics/1
  # GET /topics/1.json
  def show
    @topic = Topic.where(id:@topic[:id]).take.render_struct_topic
  end

  # GET /topics/new
  def new
    @topic = Topic.new
  end

  # GET /topics/1/edit
  def edit
  end

  # POST /topics
  # POST /topics.json
  def create
    @topic = Topic.new_with_params params
    respond_to do |format|
      if @topic.save
        format.html { redirect_to @topic, notice: 'Topic was successfully created.' }
        format.json { render json: @topic }
      else
        format.html { render action: 'new' }
        format.json { render json: @topic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /topics/1
  # PATCH/PUT /topics/1.json
  def update
    respond_to do |format|
      if @topic.update(topic_params)
        format.html { redirect_to @topic, notice: 'Topic was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @topic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /topics/1
  # DELETE /topics/1.json
  def destroy
    admin = Admin.find_by(id: cookies[:admin_id])
    @topic.destroy_with_access admin
    respond_to do |format|
      format.html { redirect_to :back }
      format.json { head :no_content }
    end
  end

  def find_user(topic)
    if !topic[:owner].nil?
      user = User.select(:id, :nickname).where(id: topic[:owner]).take
      p user
      if !@users.include? user
        @users.push user
      end
    end
    if !topic[:last_replyer].nil?
      user = User.select(:id, :nickname).where(id: topic[:last_replyer]).take
      p user
      if !@users.include? user
        @users.push user
      end
    end
  end

  def add_topic_view_num
    topic=Topic.find_by(:id=>params[:id])
    if !topic[:view_num]
      topic[:view_num]=0
    end
    topic[:view_num] +=1
    topic.save
    render json:'true'
  end



  private
  # Use callbacks to share common setup or constraints between actions.
  def set_topic
    @topic = Topic.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def topic_params
    params.require(:topic).permit(:title, :body, :owner, :last_replyer, :total_replies,:view_num)
  end


end
