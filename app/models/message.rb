class Message < ActiveRecord::Base
  attr_accessible :initiator_id, :participant_id, :initiator_status, :participant_status, :last_message_at, :initiator_deletion_id, :participant_deletion_id

  has_many :message_texts
  belongs_to :initiator, :class_name => 'User', :foreign_key => :initiator_id
  belongs_to :participant, :class_name => 'User', :foreign_key => :participant_id

  STATUS = {unseen: 0, seen: 1, read: 2, deleted: 3}

  scope :active, where('status <> ?', STATUS[:deleted])

  def send_text text, direction
    mt = MessageText.create(message_id: self.id, direction: direction, message_text: text)
    if direction == MessageText::DIRECTION[:i2p]
      self.initiator_status = STATUS[:read]
      self.participant_status = STATUS[:unseen]
    elsif direction == MessageText::DIRECTION[:p2i]
      self.initiator_status = STATUS[:unseen]
      self.participant_status = STATUS[:read]
    end
    self.last_message_at = mt.created_at
    self.save
  end

  def mark_as_read user
    if self.initiator_id == user.id
      self.update_attribute(:initiator_status, STATUS[:read])
    elsif self.participant_id == user.id
      self.update_attribute(:participant_status, STATUS[:read])
    else
      raise "Invalid Request"
    end
  end

  def delete user
    if self.initiator_id == user.id
      self.update_attributes(initiator_status: STATUS[:deleted], initiator_deletion_id: self.message_texts.last.id)
    elsif self.participant_id == user.id
      self.update_attributes(participant_status: STATUS[:deleted], participant_deletion_id: self.message_texts.last.id)
    else
      raise "Invalid Request"
    end
  end

  def self.mark_as_read messages, user
    messages.where(initiator_id: user.id).update_all(initiator_status: STATUS[:read])
    messages.where(participant_id: user.id).update_all(participant_status: STATUS[:read])
  end

  def self.mark_as_unread messages, user
    messages.where(initiator_id: user.id).update_all(initiator_status: STATUS[:seen])
    messages.where(participant_id: user.id).update_all(participant_status: STATUS[:seen])
  end

  def self.delete_selected messages, user
    messages.each do |message|
      message.delete user
    end
  end
end
