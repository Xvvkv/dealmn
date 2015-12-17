class ContactSerializer < ActiveModel::Serializer
  attributes :email, :phone, :is_primary
end
