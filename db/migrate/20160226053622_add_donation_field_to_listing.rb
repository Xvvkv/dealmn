class AddDonationFieldToListing < ActiveRecord::Migration
  def change
    add_column :listings, :is_for_donation, :boolean, :null => false, :default => false
    add_column :listings, :donated_at, :datetime
  end
end
