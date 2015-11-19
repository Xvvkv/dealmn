class ListingCategory < ActiveRecord::Base
  belongs_to :listing
  belongs_to :category
  # attr_accessible :title, :body
end
