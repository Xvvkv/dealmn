class AddColumnsToNotification < ActiveRecord::Migration
  def change
    add_column :notifications, :sender_id, :integer, references: :user
    add_column :notifications, :status, :integer, :null => false, :default => 0
  end
end
