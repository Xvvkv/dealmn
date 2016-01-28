class Rest::ListingsController < ApplicationController
  include ApplicationHelper
  respond_to :json

  before_filter :authenticate_user!
  skip_before_filter :authenticate_user!, :only => [:show, :index, :free_items]

  def index
    if params[:pid] #timeline
      if params[:pid].to_i == -1
        respond_with Listing.published.order('publishment_id desc').limit(20) 
      else
        respond_with Listing.published.where('publishment_id < ?', params[:pid].to_i).order('publishment_id desc').limit(10)
      end
    elsif params[:user_id] #user profile page
      u = User.find(params[:user_id])
      respond_with u.listings.non_draft.order('publishment_id desc')
    else # bid new page
      respond_with current_user.listings.published.order('publishment_id desc').limit(5)
    end
  end

  # won't delete. just mark it closed.
  def destroy
    listing = Listing.find(params[:id])
    raise "invalid request" unless listing.user_id == current_user.id
    listing.update_attribute(:status, Listing::STATUS[:closed])
    user_stat = listing.user.user_stat
    user_stat.total_active_listing -= 1
    user_stat.save
    respond_with :rest, listing
  end

  def show
    respond_with Listing.find(params[:id]), include_listing_detail: true, cookies: cookies
  end

  def update
    listing = Listing.find(params[:id])

    raise "invalid request" unless listing.user_id == current_user.id

    listing.title = params[:title]
    listing.text_description = params[:text_description]
    listing.wanted_description = params[:wanted_description]

    listing.is_free = (params[:is_free] == 'true')

    listing.price_range_min = params[:price_range_min] if params[:price_range_min] && is_non_negative_integer(params[:price_range_min])
    listing.price_range_max = params[:price_range_max] if params[:price_range_max] && is_non_negative_integer(params[:price_range_max])


    if params[:category] && params[:category].to_i > 0
      category = Category.find(params[:category].to_i)
      if(category.is_bottom_level)
        listing.category_id = category.id
        if(category.breadcrumb.first[:id] == Service::SERVICE_CATEGORY_ID) #Service
          if listing.item && !(listing.item.is_a? Service)
            listing.item.delete
            listing.item = nil
          end
          listing.item = listing.item || Service.create
        else #Product
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
      contact = Contact.where(user_id:current_user.id, phone: params[:phone], email: params[:email]).first_or_create
      listing.contact = contact
    else
      listing.contact = nil
    end
    
    params[:mode] ||= 0
    if params[:mode].to_i == 0
      listing.save
    elsif params[:mode].to_i == 1
      listing.publish
    elsif params[:mode].to_i == 2
      listing.update_data
    else
      raise "invalid request"
    end
    
    respond_with listing
  end

  def free_items
    respond_with Listing.free_item.published.order('publishment_id desc').limit(10) 
  end

end