class BidImage < ActiveRecord::Base
  belongs_to :bid
  belongs_to :image
  # attr_accessible :title, :body
end
