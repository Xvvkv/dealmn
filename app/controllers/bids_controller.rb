class BidsController < ApplicationController
  before_filter :authenticate_user!
  skip_before_filter :authenticate_user!, :only => [:show]

  def show
    @bid = Bid.find(params[:id])
  end

  def new
    @listing = Listing.find(params[:listing_id])
    redirect_to root_path and return unless (@listing.is_active? && @listing.user.id != current_user.id)
  end

end