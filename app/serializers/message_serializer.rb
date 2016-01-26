include ActionView::Helpers::DateHelper

class MessageSerializer < ActiveModel::Serializer
  attributes :id, :unread, :last_message, :last_message_at, :is_cur_user_initiator, :last_message_at_in_words, :participant_hash

  has_many :message_texts

  has_one :participant

  def include_message_texts?
    @options[:include_message_detail]
  end

  def message_texts
    if scope.id == object.initiator_id && object.initiator_deletion_id.present?
      object.message_texts.where('id > ?', object.initiator_deletion_id)
    elsif scope.id == object.participant_id && object.participant_deletion_id.present?
      object.message_texts.where('id > ?', object.participant_deletion_id)
    else
      object.message_texts
    end
  end

  def include_participant?
    @options[:include_message_detail]
  end

  def participant # Diffrent from actual participant. if the current_user himself is participant in this message object then this will return initiator
    if scope.id == object.initiator_id
      object.participant
    else
      object.initiator
    end
  end

  def include_participant_hash?
    !@options[:include_message_detail]
  end

  def participant_hash # tried to put this inside participant but got problems :(
    if scope.id == object.initiator_id
      {full_name: object.participant.full_name, prof_pic: object.participant.prof_pic, id: object.participant_id}
    else
      {full_name: object.initiator.full_name, prof_pic: object.initiator.prof_pic, id: object.initiator_id}
    end
  end

  def is_cur_user_initiator
    scope.id == object.initiator_id
  end

  def unread
    if scope.id == object.initiator_id
      object.initiator_status != Message::STATUS[:read]
    else
      object.participant_status != Message::STATUS[:read]
    end
  end

  def last_message
    object.message_texts.last.try(:message_text)
  end

  def last_message_at_in_words
    if ((Time.now - object.last_message_at) / 86400).round >= 7
      object.last_message_at.strftime('%Y-%m-%d %H:%M:%S')
    else
      distance_of_time_in_words_to_now(object.last_message_at)
    end
  end

end
