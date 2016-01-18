class MessageSerializer < ActiveModel::Serializer
  attributes :id, :name, :unseen, :last_message, :last_message_at

  def include_name?
    !@options[:include_detail]
  end

  def name
    if scope.id == object.initiator_id
      object.participant.full_name
    else
      object.initiator.full_name
    end
  end

  def include_unseen?
    !@options[:include_detail]
  end

  def unseen
    if scope.id == object.initiator_id
      object.initiator_status == Message::STATUS[:unseen]
    else
      object.participant_status == Message::STATUS[:unseen]
    end
  end

  def include_last_message?
    !@options[:include_detail]
  end

  def last_message
    object.message_texts.last.try(:message_text)
  end

  def last_message_at
    object.last_message_at.strftime('%Y-%m-%d %H:%M:%S')
  end

end
