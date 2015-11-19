class CreateUserStats < ActiveRecord::Migration
  def change
    create_table :user_stats do |t|
      t.references :user
      t.integer :rating_sum
      t.integer :rating_count
      t.integer :total_listing
      t.integer :total_accepted_bid
      t.timestamps
    end
  end
end
