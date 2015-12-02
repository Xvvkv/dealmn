class Category < ActiveRecord::Base
  attr_accessible :name, :is_active, :column_num, :column_order, :parent_id
  
  has_many :listing_categories
  has_many :listings, :through => :listing_categories
  
  belongs_to :parent, :class_name => 'Category', :foreign_key => :parent_id
  has_many :children, :class_name => 'Category', :foreign_key => :parent_id

  scope :active, where(is_active:true)
  scope :not_active, where(is_active:false)

  scope :top_level, where(parent_id:nil)

end
