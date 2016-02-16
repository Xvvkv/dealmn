class Rest::NotificationsController < ApplicationController
  respond_to :json
  before_filter :authenticate_user!

  def index
    raise "Invalid Request" unless params[:user_id].to_i == current_user.id
    notifications = current_user.notifications.order('id desc')
    notifications = notifications.limit(5) if params[:limit] && params[:limit] == "5" # TODO will change when we implement pagination in notifications page 
    respond_with notifications
    Notification.mark_seen current_user
  end

end