class WishList < ActiveRecord::Base
  attr_accessible :user_id,:listing_id,:status
  belongs_to :user
  belongs_to :listing

  # "bidded", "combine_bidded" (... i know they aren't word :) ...) means user made a bid for this listing item (or combine with multiple listings and made a bid)
  # Could be useful in reporting.
  STATUS = {regular: 0, deleted: 1, bidded: 2, combine_bidded:3}

  scope :regular, where(status: STATUS[:regular])
end