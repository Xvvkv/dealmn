class UsersController < ApplicationController
  before_filter :authenticate_send_message

  def show
    @user = User.find(params[:id])
  end


  private

  def authenticate_send_message
    if params[:p] == "send_msg"
      if user_signed_in?
        redirect_to "/users/#{current_user.id}?#{request.query_string}" if params[:id] == "null"
      else
        authenticate_user!
      end
    end
  end

end