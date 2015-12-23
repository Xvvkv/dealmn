class Bid < ActiveRecord::Base
  attr_accessible :title, :description, :user_id
  belongs_to :biddable, :polymorphic => true

  has_many :bid_images, dependent: :destroy
  has_many :images, :through => :bid_images

  belongs_to :user

  belongs_to :contact

  STATUS = {initial: 0, accepted: 1, deleted: 2}

  scope :initial, where(status: STATUS[:initial])
  scope :accepted, where(status: STATUS[:accepted])
  scope :deleted, where(status: STATUS[:deleted])
  

end
