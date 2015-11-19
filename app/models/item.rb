class Item < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :itemable, :polymorphic => true
  belongs_to :listing

  has_many :item_images
  has_many :images, :through => :item_images

  belongs_to :primary_image, :class_name => 'Image', :foreign_key => :primary_image_id
end
