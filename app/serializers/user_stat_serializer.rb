class UserStatSerializer < ActiveModel::Serializer
  attributes :rating, :rating_count, :total_listing, :total_accepted_bid, :total_active_listing, :current_user_rating
  def current_user_rating
    object.rating_by scope
  end
end
