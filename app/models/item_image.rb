class ItemImage < ActiveRecord::Base
  belongs_to :item
  belongs_to :image
  # attr_accessible :title, :body
end
