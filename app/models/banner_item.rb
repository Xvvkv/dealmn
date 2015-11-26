class BannerItem < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :banner
end
