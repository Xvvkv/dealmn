class Contact < ActiveRecord::Base
  attr_accessible :user_id, :email, :phone, :is_primary
  belongs_to :user
end
