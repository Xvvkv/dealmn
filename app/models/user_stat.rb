class UserStat < ActiveRecord::Base
  # attr_accessible :title, :body
  belongs_to :user

  def rating precision=1
    (self.rating_sum.to_f / self.rating_count.to_f).round(precision)
  end
end
