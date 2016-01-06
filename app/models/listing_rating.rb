class ListingRating < ActiveRecord::Base
  attr_accessible :listing_id, :rater_id, :rating
end
