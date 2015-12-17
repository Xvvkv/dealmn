class UserStatSerializer < ActiveModel::Serializer
  attributes :rating, :rating_count, :total_listing, :total_accepted_bid
end
