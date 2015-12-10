class ListingsController < ApplicationController
  
  def index
    #respond_with Category.top_level.active.order(:column_order), exclude_children: params[:exclude_children]
  end

  def show
    #respond_with Category.find(params[:id])
  end

  #publish
  def create
    #respond_with :rest, City.create(name: params[:name], description: params[:description])
  end

  #create draft
  def new
    #TODO current_user
    @listing = Listing.get_draft
    @product_conditions = ProductCondition.conditions
  end

end