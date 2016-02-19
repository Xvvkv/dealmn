class BidSerializer < ActiveModel::Serializer
  attributes :title, :description, :id, :user_id, :user_name, :biddable, :is_accepted, :accepted_date
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
    biddable = {id: object.biddable.id, title: object.biddable.title, user_id: object.biddable.user_id, user_name: object.biddable.user.display_name, is_closed: object.biddable.is_closed?, images: ActiveModel::ArraySerializer.new(object.biddable.images, each_serializer: ImageSerializer)}
    if object.status == Bid::STATUS[:accepted]
      biddable[:contact] = object.biddable.contact
    end

    biddable
  end

  def is_accepted
    object.status == Bid::STATUS[:accepted]
  end

  def accepted_date
    object.accepted_date.in_time_zone("Asia/Ulaanbaatar").strftime('%Y-%m-%d %H:%M:%S') if object.accepted_date
  end

end
