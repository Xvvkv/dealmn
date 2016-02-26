class Product < ActiveRecord::Base
  # attr_accessible :title, :body
  has_one :listing, :as => :item
  belongs_to :product_condition

  validates :condition_description,
    length: {maximum: 255}
end
