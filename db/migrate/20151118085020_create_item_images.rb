class CreateItemImages < ActiveRecord::Migration
  def change
    create_table :item_images, :id => false   do |t|
      t.references :item
      t.references :image

      t.timestamps
    end
    add_index :item_images, [:item_id,:image_id], :unique => true
  end
end
