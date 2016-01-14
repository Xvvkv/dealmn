class Rest::UsersController < ActionController::Base
  respond_to :json

  before_filter :authenticate_user!
  skip_before_filter :authenticate_user!, :only => [:show]

  def show
    respond_with User.find(params[:id])
  end

  def update
    user = User.find(params[:id])

    raise "invalid request" unless user.id == current_user.id
    
    user.contacts.update_all(is_primary: false)
    if(params[:phone].present? || params[:email].present?)
      contact = Contact.where(user_id:current_user.id, phone: params[:phone], email: params[:email]).first_or_initialize
      contact.is_primary = true
      contact.save
    end
    
    user.last_name = params[:last_name]
    user.first_name = params[:first_name]
    user.save

    respond_with user
  end

end