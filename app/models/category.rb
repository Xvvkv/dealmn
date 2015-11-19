class Category < ActiveRecord::Base
  # attr_accessible :title, :body
  has_many :listing_categories
  has_many :listings, :through => :listing_categories
  
  belongs_to :parent, :class_name => 'Category', :foreign_key => :parent_id
  has_many :children, :class_name => 'Category', :foreign_key => :parent_id

end
