class Rest::SiteStatsController < ApplicationController
  respond_to :json

  def get_stat
    respond_with SiteStat.first
  end

end