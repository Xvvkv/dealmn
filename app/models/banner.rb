class Banner < ActiveRecord::Base
  # attr_accessible :title, :body
  has_many :banner_items

  POSITION = {'TOP' => 0}
end
