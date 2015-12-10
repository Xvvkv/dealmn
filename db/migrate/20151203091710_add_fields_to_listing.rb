class AddFieldsToListing < ActiveRecord::Migration
  def change
    add_column :listings, :status, :integer, :null => false
    add_column :listings, :category_id, :integer, references: :category
  end
end
