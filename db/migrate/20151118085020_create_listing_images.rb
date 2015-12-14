class CreateListingImages < ActiveRecord::Migration
  def change
    create_table :listing_images, :id => false do |t|
      t.references :listing
      t.references :image

      t.timestamps
    end
    add_index :listing_images, [:listing_id,:image_id], :unique => true
  end
end
