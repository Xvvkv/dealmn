class UserSerializer < ActiveModel::Serializer
  attributes :email, :full_name, :display_name, :prof_pic
  has_one :user_stat
end
