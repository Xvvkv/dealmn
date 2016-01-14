class Notification < ActiveRecord::Base
  attr_accessible :message, :url
  belongs_to :user
end