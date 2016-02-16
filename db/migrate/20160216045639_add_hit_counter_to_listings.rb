class AddHitCounterToListings < ActiveRecord::Migration
  def change
    add_column :listings, :hit_counter, :integer, :null => false, :default => 0
  end
end
