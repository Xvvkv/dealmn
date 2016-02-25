class UserSerializer < ActiveModel::Serializer
  attributes :email, :full_name, :display_name, :prof_pic, :prof_pic_large, :registered_date, :id, :first_name, :last_name, :social_user
  has_one :user_stat
  has_one :primary_contact

  def social_user
    object.uid.present? && object.provider.present?
  end
end
