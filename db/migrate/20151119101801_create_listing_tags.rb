class CreateListingTags < ActiveRecord::Migration
  def change
    create_table :listing_tags do |t|
      t.references :listing
      t.references :tag
      t.integer :type
      t.timestamps
    end
  end
end
