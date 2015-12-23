class AddFieldsToBid < ActiveRecord::Migration
  def change
    add_column :bids, :title, :string, :null => false
    add_column :bids, :description, :text
    add_column :bids, :user_id, :integer, references: :user
    add_column :bids, :status, :integer, :null => false, :default => 0
    add_column :bids, :contact_id, :integer, references: :contact
    add_column :bids, :accepted_date, :datetime
  end
end
