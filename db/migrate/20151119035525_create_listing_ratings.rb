class CreateListingRatings < ActiveRecord::Migration
  def change
    create_table :listing_ratings do |t|

      t.timestamps
    end
  end
end
