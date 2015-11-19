class Bid < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :listing
end
