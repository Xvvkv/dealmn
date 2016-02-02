include ActionView::Helpers::DateHelper

class MessageTextSerializer < ActiveModel::Serializer
  attributes :id, :message_text, :direction, :created_at, :created_at_in_words
  
  def created_at
    object.created_at.strftime('%Y-%m-%d %H:%M:%S')
  end

  def created_at_in_words
    if ((Time.now - object.created_at) / 86400).round >= 7
      object.created_at.strftime('%Y-%m-%d %H:%M:%S')
    else
      distance_of_time_in_words_to_now(object.created_at)
    end
  end
end
