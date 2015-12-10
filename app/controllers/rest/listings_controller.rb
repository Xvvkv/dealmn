class Rest::ListingsController < ApplicationController
  respond_to :json

  def index
    respond_with Listing.all
  end

  def show
    respond_with Listing.find(params[:id])
  end

  def update
    listing = Listing.find(params[:id])
    listing.title = params[:title]
    listing.text_description = params[:text_description]
    listing.wanted_description = params[:wanted_description]

    if params[:category] && (params[:category].is_a? Array)
      listing.category_id = params[:category][2]
      if params[:category][0].to_i > 0
        if params[:category][0].to_i == Service::SERVICE_CATEGORY_ID
          if listing.item && !(listing.item.is_a? Service)
            listing.item.delete
            listing.item = nil
          end
          listing.item = listing.item || Service.create
        else
          if listing.item && !(listing.item.is_a? Product)
            listing.item.delete 
            listing.item = nil
          end
          listing.item = listing.item || Product.new
          listing.item.product_condition_id = params[:condition_id] 
          listing.item.condition_description = params[:condition_desc]
          listing.item.save
        end
      end  
    end  

    images = []
    if params[:images] && (params[:images].is_a? Array)
      puts 'aa'
      params[:images].each do |image_id|
        image = Image.find(image_id)
        images << image
      end
    end
    listing.images = images
    listing.save

    respond_with listing
  end

  def create
    #respond_with :rest, City.create(name: params[:name], description: params[:description])
  end

end