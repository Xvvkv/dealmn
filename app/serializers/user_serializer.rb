class UserSerializer < ActiveModel::Serializer
  attributes :email, :full_name, :display_name, :prof_pic, :registered_date, :id
  has_one :user_stat
  has_one :primary_contact
end
