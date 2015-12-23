class BidSerializer < ActiveModel::Serializer
  attributes :title, :description, :id
  has_many :images
end
