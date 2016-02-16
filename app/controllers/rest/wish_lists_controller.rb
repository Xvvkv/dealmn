class Rest::WishListsController < ActionController::Base
  respond_to :json

  before_filter :authenticate_user!
  skip_before_filter :authenticate_user!, :only => [:create, :index, :destroy]

  def create
    listing = Listing.find(params[:listing_id])
    if current_user
      raise "invalid request" if listing.user_id == current_user.id
      respond_with :rest, WishList.create(user_id: current_user.id, listing_id: params[:listing_id])
    else
      begin
        wish_list = JSON.parse(cookies[:wish_list]) if cookies[:wish_list]
      rescue
      end
      wish_list = [] unless (wish_list && (wish_list.is_a? Array))
      wish_list << params[:listing_id].to_i
      cookies[:wish_list] = wish_list.to_json
      wl = WishList.new
      wl.id=listing.id
      wl.listing = listing
      respond_with :rest, wl
    end
  end

  def destroy
    if current_user
      wish_list = WishList.find(params[:id])
      raise "invalid request" unless wish_list.user_id == current_user.id
      wish_list.destroy
    else
      begin
        wish_list = JSON.parse(cookies[:wish_list]) if cookies[:wish_list]
      rescue
      end
      wish_list = [] unless (wish_list && (wish_list.is_a? Array))
      wish_list.delete(params[:id].to_i)
      cookies[:wish_list] = wish_list.to_json
    end
    respond_with :rest, {location: nil}
  end

  def index
    if current_user
      wish_lists = current_user.wish_lists.order('id desc')
      wish_lists = wish_lists.limit(params[:limit].to_i) if params[:limit]
      if params[:include_detail] && params[:include_detail].to_i == 1
        respond_with wish_lists
      else
        respond_with wish_lists.map(&:listing_id)
      end
    else
      begin
        wish_list = JSON.parse(cookies[:wish_list]) if cookies[:wish_list]
      rescue
      end
      wish_list = [] unless (wish_list && (wish_list.is_a? Array))
      total = wish_list.size
      wish_list = wish_list[0...params[:limit].to_i] if params[:limit]

      if params[:include_detail] && params[:include_detail].to_i == 1
        listings = Listing.where('id in (?)',wish_list)
        wl_list = listings.map{|listing| wl = WishList.new; wl.id=listing.id; wl.listing = listing; wl;}
        render :json => wl_list, :meta => {:total => total}, :root => "items"
      else
        respond_with wish_list
      end
    end
  end

end