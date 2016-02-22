class Listing < ActiveRecord::Base

  attr_accessible :status, :item, :user_id, :contact_id

  before_create :randomize_id
  
  has_many :bids, :as => :biddable
  belongs_to :item, :polymorphic => true

  belongs_to :product, foreign_key: :item_id, class_name: Product, conditions: {listings: {item_type: Product}}
  belongs_to :service, foreign_key: :item_id, class_name: Service, conditions: {listings: {item_type: Service}}

  
  #delegate :product_condition_id, :product_condition, :condition_description, to: :item, allow_nil: true
  belongs_to :user

  has_many :listing_images, dependent: :destroy
  has_many :images, :through => :listing_images

  has_many :specs, dependent: :destroy

  has_many :listing_ratings
  
  belongs_to :category
  belongs_to :contact

  STATUS = {draft: 0, published: 1, closed: 2}

  scope :draft, where(status: STATUS[:draft])
  scope :non_draft, where('status <> ?', STATUS[:draft])
  scope :published, where(status: STATUS[:published])
  scope :closed, where(status: STATUS[:closed])

  scope :free_item, where(is_free: true)

  validates :title,
    presence: true,
    length: {maximum: 70 }
  
  validates :text_description,
    length: {maximum: 5000}

  validates :wanted_description,
    length: {maximum: 256}

  validates :price_range_min, :price_range_max, :inclusion => 0..2000000000, :allow_nil => true

  validates :images, :length => { :maximum => 5}

  validates :specs, :length => { :maximum => 30}



  def self.get_draft user
    Listing.create_draft(user) if user.listings.draft.blank?
    user.listings.draft.first
  end

  def self.create_draft user
    return unless user.listings.draft.blank?
    Listing.create(user_id: user.id, status: STATUS[:draft], item: Product.new, contact_id: user.primary_contact.try(:id))
  end

  def is_product
    self.item.is_a? Product
  end

  def is_draft?
    self.status == STATUS[:draft]
  end

  def is_closed?
    self.status == STATUS[:closed]
  end

  def is_active?
    [STATUS[:published]].include? self.status
  end

  def publish
    raise 'Validation Failed' unless (self.status == STATUS[:draft] && self.title.present? && self.category.is_bottom_level)

    self.status = STATUS[:published]
    self.publishment_id = next_publishment_seq
    self.published_date = Time.now
    self.save

    user_stat = self.user.user_stat
    user_stat.total_listing += 1
    user_stat.total_active_listing += 1
    user_stat.save

    site_stat = SiteStat.first
    site_stat.total_listing += 1
    site_stat.save
    
    #TODO catch uniq publishment_id constraint exception & generate id again
  end

  def update_data
    raise 'Validation Failed' unless (self.status == STATUS[:published] && self.title.present? && self.category.is_bottom_level)
    self.save
  end

  def rate rater, rating
    raise "Invalid Request" if self.user.id == rater.id
    ListingRating.create(listing_id: self.id, rater_id: rater.id, rating: rating)
  end

  def is_wish_listed? user,cookies
    if user
      return user.wish_lists.where(listing_id: self.id).present?
    elsif cookies
      begin
        wish_list = JSON.parse(cookies[:wish_list]) if cookies[:wish_list]
      rescue
      end
      return (wish_list && (wish_list.is_a? Array) && wish_list.include?(self.id))
    else
      false
    end
  end
  
  private
  
  def next_publishment_seq
    result = Listing.connection.execute("SELECT nextval('publishment_seq')")
    result[0]['nextval']
  end

  def randomize_id
    begin
      self.id = SecureRandom.random_number(100_000_000)
    end while Listing.where(id: self.id).exists?
  end

end
