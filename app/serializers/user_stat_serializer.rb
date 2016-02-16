class UserStatSerializer < ActiveModel::Serializer
  attributes :rating, :rating_count, :rating_sum, :total_listing, :total_accepted_bid, :total_active_listing, :current_user_rating, :total_bids_sent, :total_bids_received, :total_unread_messages, :total_unseen_notifications, :total_wish_list_items, :total_unseen_messages
  def current_user_rating
    object.rating_by scope if scope
  end

  def include_total_unread_messages?
    @options[:include_user_detail]
  end

  def include_total_unseen_notifications?
    @options[:include_user_detail]
  end

  def include_total_wish_list_items?
    @options[:include_user_detail]
  end
end
