class WishListSerializer < ActiveModel::Serializer
  attributes :id
  has_one :listing
end