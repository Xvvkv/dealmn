class ListingsController < ApplicationController
  before_filter :authenticate_user!
  skip_before_filter :authenticate_user!, :only => [:show]

  def show
    @listing = Listing.find(params[:id])
    redirect_to root_path and return if @listing.is_draft?
  end

  def new
    @listing = Listing.get_draft(current_user)
    @product_conditions = ProductCondition.conditions
  end

  def edit
    @listing = Listing.find(params[:id])
    redirect_to root_path and return if (!@listing.is_active? || @listing.user_id != current_user.id)
    @product_conditions = ProductCondition.conditions
  end

  def index
    @product_conditions = ProductCondition.conditions
  end

end