class Rest::ContactsController < ApplicationController
  respond_to :json

  before_filter :authenticate_user!
  
  def index

    res = {
      primary_contact: ContactSerializer.new(current_user.primary_contact),
      latest_contacts: ActiveModel::ArraySerializer.new(current_user.contacts.order('id desc').limit(5))
    }
    respond_with res
  end

end