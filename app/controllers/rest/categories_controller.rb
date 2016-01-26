class Rest::CategoriesController < ApplicationController
  respond_to :json

  def index
    respond_with Category.top_level.active.order(:column_order), exclude_children: params[:exclude_children]
  end

  def show
    respond_with Category.find(params[:id]), include_spec_suggestions: params[:include_spec_suggestions]
  end

end