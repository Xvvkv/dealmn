class Listing < ActiveRecord::Base

  attr_accessible :status, :item
  
  has_many :bids, :as => :biddable
  belongs_to :item, :polymorphic => true

  #delegate :product_condition_id, :product_condition, :condition_description, to: :item, allow_nil: true
  belongs_to :user

  has_many :listing_images, dependent: :destroy
  has_many :images, :through => :listing_images

  has_many :specs, dependent: :destroy
  
  belongs_to :category
  belongs_to :contact

  STATUS = {draft: 0, published: 1, closed: 2}

  # only bidder can create multiple_item listing.
  # listing will be created when bidder selects multiple listings
  TYPE = {regular: 0, multiple_item: 1}

  scope :draft, where(status: STATUS[:draft])
  scope :published, where(status: STATUS[:published])
  scope :closed, where(status: STATUS[:closed])

  scope :free_item, where(is_free: true)

  #TODO user id
  def self.get_draft
    Listing.create_draft if Listing.draft.blank?
    Listing.includes(:images, :specs, :item).draft.first
  end

  #TODO user id
  def self.create_draft
    return unless Listing.draft.blank?
    Listing.create(status: Listing::STATUS[:draft], item: Product.new)  
  end

  

end
