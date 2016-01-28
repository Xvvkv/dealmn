class WishListSerializer < ActiveModel::Serializer
  attributes :id, :listing
  
  def listing
    return {} unless object.listing.present?
    listing = {title: object.listing.title, text_description: object.listing.text_description, is_free: object.listing.is_free, id: object.listing.id, is_closed: object.listing.is_closed?}
    listing[:image] = {url: object.listing.images.first.image.url(:large), thumb: object.listing.images.first.image.url(:thumb)} if object.listing.images.size > 0
    listing
  end
end