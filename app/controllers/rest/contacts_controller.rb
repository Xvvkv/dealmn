class Rest::ContactsController < ApplicationController
  respond_to :json

  before_filter :authenticate_user!
  
  def index
    respond_with Contact.where(user_id: current_user.id).order('updated_at desc').limit(5)
  end

end