class AddMoreFieldsToListing < ActiveRecord::Migration
  def change
    add_column :listings, :contact_id, :integer, references: :contact
    add_column :listings, :is_free, :boolean, :null => false, :default => false
    add_column :listings, :price_range_min, :integer
    add_column :listings, :price_range_max, :integer
    add_column :listings, :published_date, :datetime
    add_index :listings, :published_date
  end
end
