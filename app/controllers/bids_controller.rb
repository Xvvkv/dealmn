class BidsController < ApplicationController
  before_filter :authenticate_user!
  skip_before_filter :authenticate_user!, :only => [:show]

  def show
    @bid = Bid.find(params[:id])
  end

  def new
    @listing = Listing.find(params[:listing_id])
  end

end