class Rest::MessagesController < ApplicationController
  respond_to :json
  before_filter :authenticate_user!

  def index
    raise "Invalid Request" unless params[:user_id].to_i == current_user.id

    respond_with current_user.messages
  end

  def show
    
  end

end