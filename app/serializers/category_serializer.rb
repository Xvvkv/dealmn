class CategorySerializer < ActiveModel::Serializer
  attributes :name, :column_num
  has_many :children

  def include_children?
    !@options[:exclude_children]
  end

  def children
    object.children.order(:column_num).order(:column_order)
  end

end
