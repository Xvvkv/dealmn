class ListingImage < ActiveRecord::Base
  belongs_to :listing
  belongs_to :image
  # attr_accessible :title, :body
end
