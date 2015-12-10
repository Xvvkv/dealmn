class Rest::ImagesController < ActionController::Base
  respond_to :json

  def create
    image = Image.new
    image.crop_x = params[:crop_x]
    image.crop_y = params[:crop_y]
    image.crop_w = params[:crop_w]
    image.crop_h = params[:crop_h]
    image.image = params[:image]
    image.save

    respond_with :rest, image
  end

  def show
    image = Image.find(params[:id])
    respond_with :rest, image
  end

  def index
    #TODO filter user & listing & ...
    respond_with Image.order("id DESC").limit(3)
  end


end