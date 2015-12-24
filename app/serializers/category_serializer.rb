class CategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :column_num, :spec_suggestions
  has_many :children

  def include_children?
    !@options[:exclude_children]
  end

  def children
    object.children.order(:column_num).order(:column_order)
  end


  def include_spec_suggestions?
    @options[:include_spec_suggestions]
  end

  def spec_suggestions
    object.spec_suggestions || []
  end

end
