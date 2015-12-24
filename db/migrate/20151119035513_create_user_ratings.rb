class CreateUserRatings < ActiveRecord::Migration
  def change
    create_table :user_ratings do |t|
      t.references :user, :null => false
      t.references :rater,  :references => :user, :null => false
      t.integer :rating, :null => false
      t.timestamps
    end
  end
end
