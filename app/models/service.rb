class Service < ActiveRecord::Base
  # attr_accessible :title, :body
  has_one :item, :as => :itemable
end
