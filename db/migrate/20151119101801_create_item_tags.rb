class CreateItemTags < ActiveRecord::Migration
  def change
    create_table :item_tags do |t|
      t.references :item
      t.references :tag
      t.integer :type
      t.timestamps
    end
  end
end
