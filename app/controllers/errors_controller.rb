class ErrorsController < ApplicationController
  
  def render404
    respond_to do |format|
      format.html { render template: 'errors/404', layout: false, status: 404 }
      format.all  { render nothing: true, status: 404 }
    end
  end

  def render500
    respond_to do |format|
      format.html { render template: 'errors/500', layout: false, status: 500 }
      format.all  { render nothing: true, status: 500 }
    end
  end

  def render422
    respond_to do |format|
      format.html { render template: 'errors/422', layout: false, status: 422 }
      format.all  { render nothing: true, status: 422 }
    end
  end

end