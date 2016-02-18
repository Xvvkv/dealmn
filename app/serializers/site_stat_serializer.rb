class SiteStatSerializer < ActiveModel::Serializer
  attributes :total_listing, :total_accepted_bid, :listing_count_today
end
