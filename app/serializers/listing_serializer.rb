class ListingSerializer < ActiveModel::Serializer
  attributes :category, :title, :text_description, :wanted_description, :is_free, :id, :published_date, :publishment_id
  has_many :images
  has_many :specs
  has_one :user
  has_one :item
  has_one :contact

  def category
    if object.category
      object.category.id_list
    else
      [-1,-1,-1]
    end
  end

  def published_date
    object.published_date.utc.strftime('%Y-%m-%d %H:%M:%S.%N')
  end

end
