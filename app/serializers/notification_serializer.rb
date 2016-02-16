include ActionView::Helpers::DateHelper

class NotificationSerializer < ActiveModel::Serializer
  attributes :message, :url, :unseen, :created_at_in_words, :sender

  def unseen
    object.status == Notification::STATUS[:unseen]
  end

  def sender
    {prof_pic: object.sender.prof_pic, name: object.sender.full_name} if object.sender_id != 0
  end

  def created_at_in_words
    if ((Time.now - object.created_at) / 86400).round >= 7
      object.created_at.strftime('%Y-%m-%d %H:%M:%S')
    else
      distance_of_time_in_words_to_now(object.created_at)
    end
  end
end
