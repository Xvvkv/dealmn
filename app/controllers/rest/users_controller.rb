class Rest::UsersController < ActionController::Base
  respond_to :json

  def create
    
  end

  def show
    user = User.find(params[:id])
    respond_with :rest, user
  end

  def index
    
  end


end