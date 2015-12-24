class CreateUserSettings < ActiveRecord::Migration
  def change
    create_table :user_settings do |t|
      t.references :user, :null => false
      t.timestamps
    end
  end
end
