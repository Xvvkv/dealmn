class Rest::CategoriesController < ApplicationController
  respond_to :json

  def index
    respond_with Category.top_level.active.order(:position_order)
  end

  def show
    respond_with Category.find(params[:id])
  end

  def create
    respond_with :rest, City.create(name: params[:name], description: params[:description])
  end

end