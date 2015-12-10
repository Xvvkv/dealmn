class ProductSerializer < ActiveModel::Serializer
  attributes :condition_description
  has_one :product_condition
end
