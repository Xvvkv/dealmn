class CategorySerializer < ActiveModel::Serializer
  attributes :name
  has_many :children

  def include_children?
    !@options[:exclude_children]
  end

end
