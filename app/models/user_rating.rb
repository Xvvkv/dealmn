class UserRating < ActiveRecord::Base
  attr_accessible :user_id, :rater_id, :rating
end
