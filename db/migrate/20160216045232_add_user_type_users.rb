class AddUserTypeUsers < ActiveRecord::Migration
  def change
    add_column :users, :user_type, :integer, :null => false, :default => 0
  end
end
