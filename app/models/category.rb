class Category < ActiveRecord::Base
  attr_accessible :name, :is_active, :column_num, :column_order, :parent_id
  
  has_many :listings

  has_many :spec_suggestions
  
  belongs_to :parent, :class_name => 'Category', :foreign_key => :parent_id
  has_many :children, :class_name => 'Category', :foreign_key => :parent_id

  scope :active, where(is_active:true)
  scope :not_active, where(is_active:false)

  scope :top_level, where(parent_id:nil)

  def id_list
    if parent
      return parent.id_list.concat [id]  
    else
      return [id]
    end
  end

  def is_bottom_level
    id_list.size == 3
  end

end
