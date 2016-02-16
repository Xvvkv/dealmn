class ListingSerializer < ActiveModel::Serializer
  attributes :breadcrumb, :title, :text_description, :wanted_description, :is_free, :price_range_min, :price_range_max, :id, :published_date, :publishment_id, :listing_stat, :is_product, :wish_listed, :is_closed?
  has_many :images
  has_many :specs
  has_one :user
  has_one :item
  has_one :contact
  has_many :bids

  def bids
    object.bids.active
  end

  def published_date
    object.published_date.utc.strftime('%Y-%m-%d %H:%M:%S.%N') if object.published_date
  end

  def include_breadcrumb?
    @options[:include_listing_detail]
  end

  def breadcrumb
    if object.category
      object.category.breadcrumb
    else
      nil
    end
  end

  def include_listing_stat?
    @options[:include_listing_detail]
  end

  def listing_stat
    ratings = object.listing_ratings.map(&:rating)
    rating_count = ratings.size
    rating_sum = ratings.inject(0, :+)

    stat = {}
    stat[:rating_count] = rating_count
    stat[:current_user_rating] = object.listing_ratings.where(rater_id: scope.id).try(:first).try(:rating) if scope
    stat[:rating] = (rating_sum.to_f / rating_count.to_f).round(1) if rating_count > 0
    stat[:rating_sum] = rating_sum

    stat
  end

  def include_wish_listed?
    @options[:include_listing_detail]
  end

  def wish_listed
    object.is_wish_listed? scope, @options[:cookies]
  end

end