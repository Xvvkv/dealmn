class Rest::UserRatingsController < ActionController::Base
  respond_to :json
  before_filter :authenticate_user!

  def create
    u = User.find_by_email(params[:user_email])
    r = params[:rating].to_i
    raise "invalid request" unless (u.present? && r > 0 && r <= 5)
    respond_with :rest, u.rate(current_user, r)
  end

end