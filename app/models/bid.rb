class Bid < ActiveRecord::Base
  attr_accessible :title, :description, :user_id, :status, :accepted_date
  belongs_to :biddable, :polymorphic => true

  belongs_to :listing, foreign_key: :biddable_id, class_name: Listing, conditions: {bids: {biddable_type: Listing}}
  

  before_create :randomize_id

  has_many :bid_images, dependent: :destroy
  has_many :images, :through => :bid_images

  belongs_to :user

  belongs_to :contact

  STATUS = {initial: 0, accepted: 1, deleted: 2}

  scope :initial, where(status: STATUS[:initial])
  scope :accepted, where(status: STATUS[:accepted])
  scope :deleted, where(status: STATUS[:deleted])

  scope :active, where('bids.status <> ?', STATUS[:deleted])

  def is_active?
    !self.is_deleted?
  end

  def is_deleted?
    self.status == STATUS[:deleted]
  end

  def is_editable?
    self.status == STATUS[:initial]
  end
  
  private

  def randomize_id
    begin
      self.id = SecureRandom.random_number(100_000_000)
    end while Bid.where(id: self.id).exists?
  end

end
