class CreateBids < ActiveRecord::Migration
  def change
    create_table :bids do |t|
      t.references :listing
      t.timestamps
    end
  end
end
