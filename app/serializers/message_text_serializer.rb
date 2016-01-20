class MessageTextSerializer < ActiveModel::Serializer
  attributes :id, :message_text, :direction, :created_at
  
  def created_at
    object.created_at.strftime('%Y-%m-%d %H:%M:%S')
  end
end
