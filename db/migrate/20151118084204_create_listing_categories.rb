class CreateListingCategories < ActiveRecord::Migration
  def change
    create_table :listing_categories, :id => false  do |t|
      t.references :listing
      t.references :category

      t.timestamps
    end
    add_index :listing_categories, [:listing_id, :category_id], :unique => true
  end
end
