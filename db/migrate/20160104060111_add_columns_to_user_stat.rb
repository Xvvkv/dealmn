class AddColumnsToUserStat < ActiveRecord::Migration
  def change
    add_column :user_stats, :total_active_listing, :integer, :null => false, :default => 0
  end
end
