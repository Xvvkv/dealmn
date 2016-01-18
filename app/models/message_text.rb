class MessageText < ActiveRecord::Base
  attr_accessible :message_id, :direction, :message_text
  belongs_to :message

  DIRECTION = {i2p: 0, p2i: 1} # i2p => initiator to participant, p2i => participant to initiator

  scope :i2p, where(direction: DIRECTION[:i2p])
  scope :p2i, where(direction: DIRECTION[:p2i])

end
