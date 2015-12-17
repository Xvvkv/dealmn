class CreateUserStats < ActiveRecord::Migration
  def change
    create_table :user_stats do |t|
      t.references :user, :null => false
      t.integer :rating_sum, :null => false, :default => 0
      t.integer :rating_count, :null => false, :default => 0
      t.integer :total_listing, :null => false, :default => 0
      t.integer :total_accepted_bid, :null => false, :default => 0
      t.timestamps
    end
  end
end
