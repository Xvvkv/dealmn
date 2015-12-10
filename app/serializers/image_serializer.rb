class ImageSerializer < ActiveModel::Serializer
  attributes :id, :url, :thumb
  
  def url
    object.image.url(:large)
  end

  def thumb
    object.image.url(:thumb)
  end

end
