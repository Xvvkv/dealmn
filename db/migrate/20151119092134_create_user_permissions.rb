class CreateUserPermissions < ActiveRecord::Migration
  def change
    create_table :user_permissions do |t|
      t.references :user, :null => false
      t.integer :permission, :null => false
      t.timestamps
    end
  end
end
