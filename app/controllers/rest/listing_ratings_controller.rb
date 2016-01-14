class Rest::ListingRatingsController < ActionController::Base
  respond_to :json
  before_filter :authenticate_user!

  def create
    l = Listing.find(params[:listing_id])
    r = params[:rating].to_i
    raise "invalid request" unless (r > 0 && r <= 5)
    lr = l.rate(current_user, r)
    respond_with :rest, l, lr
  end

end