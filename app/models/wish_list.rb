class WishList < ActiveRecord::Base
  attr_accessible :user_id,:listing_id
  belongs_to :user
  belongs_to :listing
end