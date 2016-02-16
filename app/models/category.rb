class Category < ActiveRecord::Base
  attr_accessible :name, :is_active, :column_num, :column_order, :parent_id
  
  has_many :listings

  has_many :spec_suggestions
  
  belongs_to :parent, :class_name => 'Category', :foreign_key => :parent_id
  has_many :children, :class_name => 'Category', :foreign_key => :parent_id

  scope :active, where(is_active:true)
  scope :not_active, where(is_active:false)

  scope :top_level, where(parent_id:nil)

  def breadcrumb
    if parent
      return parent.breadcrumb.concat [{id: id, name: name}]  
    else
      return [{id: id, name: name}]
    end
  end

  def bottom_level_categories
    if children.present?
      return children.map(&:bottom_level_categories).flatten
    else
      return [id]
    end
  end


  def is_bottom_level
    breadcrumb.size == 3
  end

end
