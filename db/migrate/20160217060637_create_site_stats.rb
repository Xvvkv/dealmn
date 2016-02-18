class CreateSiteStats < ActiveRecord::Migration
  def change
    create_table :site_stats do |t|
      t.integer :total_listing, :null => false, :default => 0
      t.integer :total_accepted_bid, :null => false, :default => 0
      t.timestamps
    end
  end
end
