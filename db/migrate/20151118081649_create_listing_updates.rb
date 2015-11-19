class CreateListingUpdates < ActiveRecord::Migration
  def change
    create_table :listing_updates do |t|
      t.references :listing
      t.timestamps
    end
  end
end
