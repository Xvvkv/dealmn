class ListingSerializer < ActiveModel::Serializer
  attributes :category, :title, :text_description, :wanted_description
  has_many :images
  has_many :specs
  has_one :item

  def category
    if object.category
      object.category.id_list
    else
      [-1,-1,-1]
    end
  end

end
