class Rest::UsersController < ActionController::Base
  respond_to :json

  def show
    respond_with User.find(params[:id])
  end

end