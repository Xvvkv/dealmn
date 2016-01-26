class Rest::MessagesController < ApplicationController
  respond_to :json
  before_filter :authenticate_user!

  def index
    raise "Invalid Request" unless params[:user_id].to_i == current_user.id
    options = {mark_seen: true}
    options[:limit] = 5 if params[:limit] && params[:limit] == "5" # TODO will change when we implement pagination in messages page (or scrolling in messages panel etc..) Right now only 5 will be accepted :)
    respond_with current_user.messages(options)
  end

  def show
    if params[:id] == "0"
      user = User.find(params[:message_u_id])
      message = Message.where(participant_id: current_user.id, initiator_id: user.id)
      unless message.present?
        message = Message.where(initiator_id: current_user.id, participant_id: user.id).first_or_initialize
        message.last_message_at ||= Time.now
      end
    else
      message = Message.find(params[:id])
    end
    message.mark_as_read(current_user) if message.id.present?
    raise "Invalid Request" unless (params[:user_id].to_i == current_user.id) && (message.participant_id == current_user.id || message.initiator_id == current_user.id)
    respond_with message, include_message_detail: true
  end

  def create
    user = User.find(params[:participant_id])
    message = Message.where(participant_id: current_user.id, initiator_id: user.id).first
    direction = MessageText::DIRECTION[:p2i]
    unless message.present?
      message = Message.where(initiator_id: current_user.id, participant_id: user.id).first_or_initialize
      unless message.id
        message.initiator_status = Message::STATUS[:read]
        message.participant_status = Message::STATUS[:unseen]
        message.last_message_at = Time.now
        message.save
      end
      direction = MessageText::DIRECTION[:i2p]
    end
    message.send_text(params[:text], direction)
    respond_with :rest, current_user, message, include_message_detail: true
  end

  def mark
    raise "Invalid Request" unless params[:user_id].to_i == current_user.id
    selected_ids = params[:selected_ids].map(&:to_i)
    messages = Message.where('id in (?)', selected_ids)

    if params[:as_read].to_i == 1
      Message.mark_as_read(messages, current_user)
    else
      Message.mark_as_unread(messages, current_user)
    end

    render :nothing => true, :status => 200
  end

  def delete_selected
    raise "Invalid Request" unless params[:user_id].to_i == current_user.id
    selected_ids = params[:selected_ids].map(&:to_i)
    messages = Message.where('id in (?)', selected_ids)

    Message.delete_selected(messages, current_user)

    render :nothing => true, :status => 200
  end

end