class Service < ActiveRecord::Base
  # attr_accessible :title, :body
  has_one :listing, :as => :item

  #TODO change it
  SERVICE_CATEGORY_ID=26
end
