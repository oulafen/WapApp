class SearchController < ApplicationController
  def initialize
    @search_list = [App,Video]
  end
  def index
    @result = {}
    @search_list.each do |model|
      @result[model.to_s] = []
    end

    if !(params[:key].nil? || params[:key]=="")
      search_text params[:key]
    end


    @result["App"].each do |app|
      app.logo_file_name = app.logo.url
      app.logo_file_size=DownloadApp.where(:app_id=>app[:id]).length
      reply_num=Reply.find_reply_info_for_item('App',app[:id])['total_number']
      if !reply_num
        reply_num=0
      end
      app.apk_size=reply_num
    end
    respond_to do |format|
      format.json { render json: @result}
    end
  end

  def search_text(text)
    @search_list.each do |model|
      search = model.search do
        fulltext text
      end
      search.results.each do |result|
        @result[model.to_s].unshift result
      end
    end
  end
end