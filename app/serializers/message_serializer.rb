class MessageSerializer < ActiveModel::Serializer
  attributes :id, :participant_name, :unread, :last_message, :last_message_at, :is_cur_user_initiator

  has_many :message_texts

  has_one :participant

  def include_message_texts?
    @options[:include_detail]
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

  def participant_name
    if scope.id == object.initiator_id
      object.participant.full_name
    else
      object.initiator.full_name
    end
  end

  def include_participant?
    @options[:include_detail]
  end

  def participant # Diffrent from actual participant. if the current_user himself is participant in this message object then this will return initiator
    if scope.id == object.initiator_id
      object.participant
    else
      object.initiator
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

  def last_message_at
    object.last_message_at.strftime('%Y-%m-%d %H:%M:%S')
  end

end
