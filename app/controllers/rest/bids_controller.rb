class Rest::BidsController < ApplicationController
  respond_to :json

  before_filter :authenticate_user!
  skip_before_filter :authenticate_user!, :only => [:show, :index, :latest_deals]

  def index
    if params[:listing_id]
      #TODO
      raise "not implemented yet"
    else
      if current_user
        if params[:limit] && params[:limit] == "5"
          respond_with :rest, current_user.bids.active.order('id desc').limit(5)
        elsif params[:is_sent_bid]
          respond_with :rest, current_user.bids.active.order('id desc'), include_biddable: true
        else
          respond_with :rest, Bid.active.joins(:listing).where(:listings => {:user_id => current_user.id}).order('bids.id desc'), include_biddable: true
        end
      else
        raise "unauthorized request"
      end
    end
  end

  def show
    respond_with Bid.find(params[:id]), include_user: true, include_biddable: true
  end

  def update
    bid = Bid.find(params[:id])
    raise "invalid request" unless bid.user_id == current_user.id

    bid.title = params[:title].try(:strip)
    bid.description = params[:description].try(:strip)

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
      contact = Contact.where(user_id: current_user.id, phone: (params[:phone].present? ? params[:phone].strip : nil), email: (params[:email].present? ? params[:email].strip : nil)).first_or_create
      bid.contact = contact
    else
      bid.contact = nil
    end

    bid.save!

    bid.biddable.user.send_notification(I18n.t('notifications.bid_updated', {listing_name: bid.biddable.title, bid_name: bid.title}), "/bids/#{bid.id}", current_user)

    respond_with :rest, bid
  end

  def destroy
    bid = Bid.find(params[:id])
    raise "invalid request" unless bid.user_id == current_user.id
    bid.update_attribute(:status, Bid::STATUS[:deleted])
    
    user_stat_bidder = current_user.user_stat
    user_stat_listing_owner = bid.biddable.user.user_stat
    user_stat_bidder.total_bids_sent -= 1
    user_stat_listing_owner.total_bids_received -= 1
    user_stat_bidder.save
    user_stat_listing_owner.save

    bid.biddable.user.send_notification(I18n.t('notifications.bid_deleted', {listing_name: bid.biddable.title, bid_name: bid.title}), "/listings/#{bid.biddable.id}", current_user)

    respond_with :rest, bid
  end

  def create

    raise "invalid request. TOS must be agreed" unless current_user.tos_agreed_at.present?

    if params[:listing_id]
      listing = Listing.find(params[:listing_id])

      raise "Self bidding isn't allowed" if listing.user_id == current_user.id
      
      if listing
        bid = Bid.new(title: params[:title].try(:strip), description: params[:description].try(:strip), user_id: current_user.id)
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
          contact = Contact.where(user_id: current_user.id, phone: (params[:phone].present? ? params[:phone].strip : nil), email: (params[:email].present? ? params[:email].strip : nil)).first_or_create
          bid.contact = contact
        end

        bid.save!

        user_stat_bidder = current_user.user_stat
        user_stat_listing_owner = listing.user.user_stat
        user_stat_bidder.total_bids_sent += 1
        user_stat_listing_owner.total_bids_received += 1
        user_stat_bidder.save
        user_stat_listing_owner.save

        listing.user.send_notification(I18n.t('notifications.bid_received', {listing_name: listing.title, bid_name: bid.title}), "/bids/#{bid.id}", current_user)

      end

      respond_with :rest, bid
    elsif params[:listing_group_id]
      #listing group TODO
    else
      raise "invalid request"
    end
  end

  def accept
    bid = Bid.find(params[:id])
    raise "Invalid Request" unless bid.is_active? && bid.biddable.user_id == current_user.id && bid.biddable.is_active?

    bid.update_attributes(:status => Bid::STATUS[:accepted], :accepted_date => Time.now)

    user_stat_bidder = bid.user.user_stat
    user_stat_listing_owner = current_user.user_stat
    user_stat_bidder.total_accepted_bid += 1
    user_stat_listing_owner.total_accepted_bid += 1
    user_stat_bidder.save
    user_stat_listing_owner.save

    site_stat = SiteStat.first
    site_stat.total_accepted_bid += 1
    site_stat.save

    bid.user.send_notification(I18n.t('notifications.bid_accepted', {listing_name: bid.biddable.title, bid_name: bid.title}), "/bids/#{bid.id}", current_user)

    render :nothing => true, :status => 200
  end

  def latest_deals
    raise "Invalid Request" unless params[:limit] && (params[:limit].to_i == 3 || params[:limit].to_i == 10)
    respond_with Bid.accepted.order('accepted_date desc').first(params[:limit].to_i), include_user: true, include_biddable: true
  end

end