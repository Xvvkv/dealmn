class AddRatingIndexes < ActiveRecord::Migration
  def change
    add_index :user_ratings, [:user_id,:rater_id], :unique => true
    add_index :listing_ratings, [:listing_id,:rater_id], :unique => true
  end
end
