class CreateBidImages < ActiveRecord::Migration
  def change
    create_table :bid_images, :id => false do |t|
      t.references :bid, :null => false
      t.references :image, :null => false

      t.timestamps
    end
    add_index :bid_images, [:bid_id,:image_id], :unique => true
  end
end
