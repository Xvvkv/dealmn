class Notification < ActiveRecord::Base
  attr_accessible :message, :url, :status, :user_id, :sender_id
  belongs_to :user
  belongs_to :sender, :class_name => 'User', :foreign_key => :sender_id
  
  STATUS = {unseen: 0, seen: 1}

  scope :unseen, where(status: STATUS[:unseen])
end