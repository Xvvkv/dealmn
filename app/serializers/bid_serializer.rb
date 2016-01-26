class BidSerializer < ActiveModel::Serializer
  attributes :title, :description, :id, :user_id, :user_name, :biddable, :is_accepted
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
    if object.status == Bid::STATUS[:accepted]
      {id: object.biddable.id, title: object.biddable.title, user_id: object.biddable.user_id, contact: object.biddable.contact, is_closed: object.biddable.is_closed?}
    else
      {id: object.biddable.id, title: object.biddable.title, user_id: object.biddable.user_id, is_closed: object.biddable.is_closed?}
    end
  end

  def is_accepted
    object.status == Bid::STATUS[:accepted]
  end
end
