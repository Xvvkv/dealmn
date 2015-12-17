class Rest::ContactsController < ApplicationController
  respond_to :json

  def index
    # TODO filter current user
    respond_with Contact.order('updated_at desc').limit(5)
  end

  def show
    #respond_with Category.find(params[:id]), include_spec_suggestions: params[:include_spec_suggestions]
  end

  def create
    #respond_with :rest, City.create(name: params[:name], description: params[:description])
  end

end