class Rest::WishListsController < ActionController::Base
  respond_to :json

  def create
    if current_user
      respond_with :rest, WishList.create(user_id: current_user.id, listing_id: params[:listing_id])
    else
      begin
        wish_list = JSON.parse(cookies[:wish_list]) if cookies[:wish_list]
      rescue
      end
      if (wish_list && (wish_list.is_a? Array))
        wish_list << params[:listing_id].to_i
      else
        wish_list = [params[:listing_id].to_i]
      end
      cookies[:wish_list] = wish_list.to_json
      respond_with :rest, {location: nil}
    end
  end

  def index
    if current_user
      respond_with current_user.wish_lists.map(&:listing_id)
    else
      begin
        wish_list = JSON.parse(cookies[:wish_list]) if cookies[:wish_list]
      rescue
      end
      if (wish_list && (wish_list.is_a? Array))
        respond_with wish_list
      else
        respond_with []
      end
    end
  end

end