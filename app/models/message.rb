class Message < ActiveRecord::Base
  attr_accessible :initiator_id, :participant_id, :initiator_status, :participant_status, :last_message_at, :last_initiator_deleted_message, :last_participant_deleted_message

  has_many :message_texts
  belongs_to :initiator, :class_name => 'User', :foreign_key => :initiator_id
  belongs_to :participant, :class_name => 'User', :foreign_key => :participant_id

  STATUS = {unseen: 0, seen: 1, deleted: 2}

  scope :active, where('status <> ?', STATUS[:deleted])

  def send_text text, direction
    mt = MessageText.create(message_id: self.id, direction: direction, message_text: text)
    if direction == MessageText::DIRECTION[:i2p]
      self.initiator_status = STATUS[:seen]
      self.participant_status = STATUS[:unseen]
    elsif direction == MessageText::DIRECTION[:p2i]
      self.initiator_status = STATUS[:unseen]
      self.participant_status = STATUS[:seen]
    end
    self.last_message_at = mt.created_at
    self.save
  end
end
