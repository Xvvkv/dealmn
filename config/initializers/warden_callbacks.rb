Warden::Manager.after_authentication do |user, auth, opts|
  begin
    wish_list = JSON.parse(auth.cookies[:wish_list]) if auth.cookies[:wish_list]
  rescue
  end
  if(wish_list && (wish_list.is_a? Array))
    wish_list -= user.wish_lists.map(&:listing_id)
    wish_list.each do |listing_id|
      listing = Listing.find(listing_id)
      next if listing.user_id == user.id
      WishList.create(user_id: user.id, listing_id: listing_id)
    end
  end
  auth.cookies.delete :wish_list
end