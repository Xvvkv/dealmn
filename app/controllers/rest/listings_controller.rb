class Rest::ListingsController < ApplicationController
  include ApplicationHelper
  respond_to :json

  before_filter :authenticate_user!
  skip_before_filter :authenticate_user!, :only => [:show, :index, :free_items, :fetch_ids]

  def index
    if params[:user_id] #user profile page
      u = User.find(params[:user_id])
      respond_with u.listings.non_draft.order('publishment_id desc')
    elsif params[:ids] #timeline
      raise "Invalid Request" unless params[:ids].is_a? Array
      respond_with Listing.non_draft.where('id in (?)',params[:ids]).order('publishment_id desc').limit(20) # request is consists of either 20 or 10 ids. Just in case of malformed request we're putting additional limit here
    else # bid new page
      respond_with current_user.listings.non_draft.order('publishment_id desc').limit(5)
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
    listing.bids.initial.each do |bid|
      bid.user.send_notification(I18n.t('notifications.listing_closed', {listing_name: listing.title, bid_name: bid.title}), "/listings/#{listing.id}", current_user)
    end
    respond_with :rest, listing
  end

  def show
    l = Listing.find(params[:id])
    l.update_attribute(:hit_counter, l.hit_counter + 1)
    respond_with l, include_listing_detail: true, cookies: cookies
  end

  def update
    listing = Listing.find(params[:id])

    raise "invalid request" unless listing.user_id == current_user.id

    listing.title = params[:title].strip
    listing.text_description = params[:text_description].strip
    listing.wanted_description = params[:wanted_description].strip

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
          listing.item.condition_description = params[:condition_desc].strip
          listing.item.save!
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
        spec = Spec.where(listing_id: listing.id, name: name.strip).first_or_initialize
        if s[:value].present?
          spec.value = s[:value].strip
          spec.save
          specs << spec
        else
          spec.delete
        end
      end
    end
    listing.specs = specs

    if(params[:phone].present? || params[:email].present?)
      contact = Contact.where(user_id:current_user.id, phone: (params[:phone].present? ? params[:phone].strip : nil), email: (params[:email].present? ? params[:email].strip : nil)).first_or_create
      listing.contact = contact
    else
      listing.contact = nil
    end
    
    params[:mode] ||= 0
    if params[:mode].to_i == 0
      listing.save!
    elsif params[:mode].to_i == 1
      listing.publish
    elsif params[:mode].to_i == 2
      listing.update_data
      listing.bids.initial.each do |bid|
        bid.user.send_notification(I18n.t('notifications.listing_updated', {listing_name: listing.title, bid_name: bid.title}), "/listings/#{listing.id}", current_user)
      end
    else
      raise "invalid request"
    end
    
    respond_with listing
  end

  def free_items
    respond_with Listing.free_item.published.order('publishment_id desc').limit(10) 
  end

  def fetch_ids

    listings = Listing
    listings = listings.joins(:product) if params[:product_condition]
    listings = listings.joins('LEFT JOIN (SELECT ROUND(AVG(rating)) AS rating, listing_id FROM listing_ratings GROUP BY listing_id) avg_ratings ON listings.id = avg_ratings.listing_id') if params[:rating]

    listings = listings.order('publishment_id desc')
    listings = listings.where('publishment_id < ?', params[:pid].to_i) if params[:pid]
    if params[:category_id]
      category = Category.find(params[:category_id])
      listings = listings.where('category_id in (?)', category.bottom_level_categories)
    end
    listings = listings.free_item if params[:is_free] && params[:is_free] == 'true'
    listings = listings.where(:products => {:product_condition_id => params[:product_condition]}) if params[:product_condition]
    listings = listings.where('avg_ratings.rating >= ?', params[:rating].to_i) if params[:rating]

    if params[:include_closed] && params[:include_closed] == 'true'
      listings = listings.non_draft
    else
      listings = listings.published
    end

    listings = listings.where('price_range_max is null or price_range_max >= ?', params[:price_range_min].to_i) if params[:price_range_min]
    listings = listings.where('price_range_min is null or price_range_min <= ?', params[:price_range_max].to_i) if params[:price_range_max]

    if params[:search_text].present?
      listings = listings.where('title ILIKE ?', "%#{params[:search_text]}%")
      # TODO need to search from tags, specs etc
    end

    listings = listings.limit(200)

    listings = listings.select('listings.id')

    respond_with listings.map(&:id)
  end

end