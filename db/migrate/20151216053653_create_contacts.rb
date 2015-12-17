class CreateContacts < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.references :user, :null => false
      t.string :email
      t.string :phone
      t.boolean :is_primary, :null => false, :default => false
      t.timestamps
    end
    add_index :contacts, [:email,:phone], :unique => true
  end
end
