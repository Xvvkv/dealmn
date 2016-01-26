class AddMoreColumnsToUserStat < ActiveRecord::Migration
  def change
    add_column :user_stats, :total_bids_sent, :integer, :null => false, :default => 0
    add_column :user_stats, :total_bids_received, :integer, :null => false, :default => 0
  end
end
