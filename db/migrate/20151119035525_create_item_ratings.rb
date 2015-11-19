class CreateItemRatings < ActiveRecord::Migration
  def change
    create_table :item_ratings do |t|

      t.timestamps
    end
  end
end
