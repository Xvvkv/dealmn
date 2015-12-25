class Listing < ActiveRecord::Base

  attr_accessible :status, :item, :user_id
  
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

  scope :draft, where(status: STATUS[:draft])
  scope :published, where(status: STATUS[:published])
  scope :closed, where(status: STATUS[:closed])

  scope :free_item, where(is_free: true)

  def self.get_draft user
    Listing.create_draft(user) if user.listings.draft.blank?
    user.listings.draft.first
  end

  def self.create_draft user
    return unless user.listings.draft.blank?
    Listing.create(user_id: user.id, status: STATUS[:draft], item: Product.new)  
  end

  def publish
    raise 'Validation Failed' unless (self.status == STATUS[:draft] && self.title.present? && self.category.is_bottom_level)

    self.status = STATUS[:published]
    self.publishment_id = next_publishment_seq
    self.published_date = Time.now
    self.save

    #TODO catch uniq publishment_id constraint exception & generate id again
  end

  
  private
    def next_publishment_seq
      result = Listing.connection.execute("SELECT nextval('publishment_seq')")
      result[0]['nextval']
    end 
end
