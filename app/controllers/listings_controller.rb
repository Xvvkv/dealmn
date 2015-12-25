class ListingsController < ApplicationController
  before_filter :authenticate_user!
  skip_before_filter :authenticate_user!, :only => [:show]

  def show
    #respond_with Category.find(params[:id])
  end

  def new
    #TODO current_user
    @listing = Listing.get_draft(current_user)
    @product_conditions = ProductCondition.conditions
  end

end