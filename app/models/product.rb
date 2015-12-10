class Product < ActiveRecord::Base
  # attr_accessible :title, :body
  has_one :listing, :as => :item
  belongs_to :product_condition
end
