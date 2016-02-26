class SiteStat < ActiveRecord::Base
  # attr_accessible :title, :body
  def listing_count_today
    Listing.non_draft.where("created_at >= ?", Time.zone.now.beginning_of_day).count
  end
end
