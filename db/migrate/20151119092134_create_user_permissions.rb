class CreateUserPermissions < ActiveRecord::Migration
  def change
    create_table :user_permissions do |t|

      t.timestamps
    end
  end
end
