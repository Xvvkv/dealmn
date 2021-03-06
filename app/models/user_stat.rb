class UserStat < ActiveRecord::Base
  attr_accessible :user_id
  belongs_to :user

  def rating precision=1
    (self.rating_sum.to_f / self.rating_count.to_f).round(precision) if self.rating_count > 0
  end

  def rating_by user
    self.user.ratings.where(rater_id: user.id).try(:first).try(:rating)
  end

  def total_unread_messages
    self.user.unread_messages.size
  end

  def total_unseen_messages
    self.user.unseen_messages.size
  end

  def total_unseen_notifications
    self.user.notifications.unseen.size
  end

  def total_wish_list_items
    self.user.wish_lists.size
  end
end
