class BidSerializer < ActiveModel::Serializer
  attributes :title, :description, :id, :user_id, :user_name, :biddable
  has_many :images
  has_one :user
  has_one :contact

  def include_user_id?
    !@options[:include_user]
  end

  def include_user_name?
    !@options[:include_user]
  end

  def user_name
    object.user.full_name
  end

  def include_user?
    @options[:include_user]
  end

  def include_biddable?
    @options[:include_biddable]
  end

  def biddable
    {id: object.biddable.id, title: object.biddable.title}
  end
end
