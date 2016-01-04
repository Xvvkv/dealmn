class UserStat < ActiveRecord::Base
  attr_accessible :user_id
  belongs_to :user

  def rating precision=1
    (self.rating_sum.to_f / self.rating_count.to_f).round(precision) if self.rating_count > 0
  end

  def rating_by user
    self.user.ratings.where(rater_id: user.id).try(:first).try(:rating)
  end
end
