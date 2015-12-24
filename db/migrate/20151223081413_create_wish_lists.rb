class CreateWishLists < ActiveRecord::Migration
  def change
    create_table :wish_lists do |t|
      t.references :listing, :null => false
      t.references :user, :null => false
      t.integer :status
      t.timestamps
    end
  end
end
