class Rest::UsersController < ActionController::Base
  respond_to :json

  before_filter :authenticate_user!
  skip_before_filter :authenticate_user!, :only => [:show]

  def show
    respond_with User.find(params[:id]), include_user_detail: (current_user && params[:id].to_i == current_user.id )
  end

  def update
    user = User.find(params[:id])

    raise "invalid request" unless user.id == current_user.id

    if params[:image].present?
      image = Image.new
      image.crop_x = params[:crop_x]
      image.crop_y = params[:crop_y]
      image.crop_w = params[:crop_w]
      image.crop_h = params[:crop_h]
      image.image = params[:image]
      image.save
      user.avatar.destroy if user.avatar.present?
      user.avatar = image
    end
    
    user.contacts.update_all(is_primary: false)
    if(params[:phone].present? || params[:email].present?)
      contact = Contact.where(user_id:current_user.id, phone: (params[:phone].present? ? params[:phone].strip : nil), email: (params[:email].present? ? params[:email].strip : nil)).first_or_initialize
      contact.is_primary = true
      contact.save
    end
    
    user.last_name = params[:last_name].strip
    user.first_name = params[:first_name].strip
    user.save

    #respond_with :rest, user
    render json: user # put request was sending 204 no content response.
  end

end