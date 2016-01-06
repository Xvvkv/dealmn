class Rest::BidsController < ApplicationController
  respond_to :json

  before_filter :authenticate_user!
  skip_before_filter :authenticate_user!, :only => [:show, :index]

  def index
    if params[:listing_id]
      #TODO
      raise "not implemented yet"
    else
      if current_user
        respond_with :rest, current_user.bids.order('id desc').limit(5);
      else
        raise "unauthorized request"
      end
    end
  end

  def show
    respond_with Bid.find(params[:id]), include_user: true, include_biddable: true
  end

  def create
    if params[:listing_id]
      listing = Listing.find(params[:listing_id])

      raise "Self bidding isn't allowed" if listing.user_id == current_user.id
      
      if listing
        bid = Bid.new(title: params[:title], description: params[:description], user_id: current_user.id)
        bid.biddable = listing

        images = []
        if params[:images] && (params[:images].is_a? Array)
          params[:images].each do |image_id|
            image = Image.find(image_id)
            images << image
          end
        end
        bid.images = images

        if(params[:phone].present? || params[:email].present?)
          #TODO check user id
          contact = Contact.where(user_id: current_user.id, phone: params[:phone], email: params[:email]).first_or_create
          bid.contact = contact
        end

        bid.save
      end

      respond_with :rest, bid
    elsif params[:listing_group_id]
      #listing group TODO
    else
      raise "invalid request"
    end
  end

end