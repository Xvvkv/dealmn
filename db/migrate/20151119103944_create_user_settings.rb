class CreateUserSettings < ActiveRecord::Migration
  def change
    create_table :user_settings do |t|

      t.timestamps
    end
  end
end
