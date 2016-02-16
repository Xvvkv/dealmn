class WishListsController < ApplicationController

  #only for guest user
  def index
    redirect_to root_path and return if current_user.present?
  end

end