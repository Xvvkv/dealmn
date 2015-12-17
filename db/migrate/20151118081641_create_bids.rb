class CreateBids < ActiveRecord::Migration
  def change
    create_table :bids do |t|
      t.references :biddable, :polymorphic => true, :null => false
      
      t.timestamps
    end
  end
end
