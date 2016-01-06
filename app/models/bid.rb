class Bid < ActiveRecord::Base
  attr_accessible :title, :description, :user_id
  belongs_to :biddable, :polymorphic => true

  before_create :randomize_id

  has_many :bid_images, dependent: :destroy
  has_many :images, :through => :bid_images

  belongs_to :user

  belongs_to :contact

  STATUS = {initial: 0, accepted: 1, deleted: 2}

  scope :initial, where(status: STATUS[:initial])
  scope :accepted, where(status: STATUS[:accepted])
  scope :deleted, where(status: STATUS[:deleted])
  
  private

  def randomize_id
    begin
      self.id = SecureRandom.random_number(100_000_000)
    end while Bid.where(id: self.id).exists?
  end

end
