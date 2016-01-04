class ListingSerializer < ActiveModel::Serializer
  attributes :category, :title, :text_description, :wanted_description, :is_free, :id, :published_date, :publishment_id, :listing_stat
  has_many :images
  has_many :specs
  has_one :user
  has_one :item
  has_one :contact
  has_many :bids

  def category
    if object.category
      object.category.id_list
    else
      [-1,-1,-1]
    end
  end

  def published_date
    object.published_date.utc.strftime('%Y-%m-%d %H:%M:%S.%N') if object.published_date
  end

  def listing_stat
    ratings = object.listing_ratings.map(&:rating)
    rating_count = ratings.size
    rating_sum = ratings.inject(0, :+)

    stat = {}
    stat[:rating_count] = rating_count
    stat[:current_user_rating] = object.listing_ratings.where(rater_id: scope.id).try(:first).try(:rating)
    stat[:rating] = (rating_sum.to_f / rating_count.to_f).round(1) if rating_count > 0

    stat
  end

end