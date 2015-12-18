class Rest::ListingsController < ApplicationController
  respond_to :json

  def index
    respond_with Listing.published
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
      params[:images].each do |image_id|
        image = Image.find(image_id)
        images << image
      end
    end
    listing.images = images

    specs = []
    if params[:specs] && (params[:specs].is_a? Hash)
      params[:specs].each do |name, s|
        spec = Spec.where(listing_id: listing.id, name: name).first_or_initialize
        if s[:value].present?
          spec.value = s[:value]
          spec.save
          specs << spec
        else
          spec.delete
        end
      end
    end
    listing.specs = specs

    if(params[:phone].present? || params[:email].present?)
      #TODO check user id
      contact = Contact.where(user_id:1 ,phone: params[:phone], email: params[:email]).first_or_create
      listing.contact = contact
    end


    listing.save

    respond_with listing
  end

  def create
    #respond_with :rest, City.create(name: params[:name], description: params[:description])
  end

end