class CreateUserRatings < ActiveRecord::Migration
  def change
    create_table :user_ratings do |t|

      t.timestamps
    end
  end
end
