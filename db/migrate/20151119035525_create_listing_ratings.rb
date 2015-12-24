class CreateListingRatings < ActiveRecord::Migration
  def change
    create_table :listing_ratings do |t|
      t.references :listing, :null => false
      t.references :rater,  :references => :user, :null => false
      t.integer :rating, :null => false
      t.timestamps
    end
  end
end
