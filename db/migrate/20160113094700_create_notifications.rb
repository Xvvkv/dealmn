class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.references :user, :null => false
      t.text :message, :null => false
      t.string :url

      t.timestamps
    end
  end
end
