class Listing < ActiveRecord::Base
  # attr_accessible :title, :body
  has_many :items
  has_many :bids
  has_many :listing_updates

  has_many :listing_categories
  has_many :categories, :through => :listing_categories

end
