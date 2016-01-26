class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.references :initiator, :references => :user, :null => false
      t.references :participant,  :references => :user, :null => false
      t.integer :initiator_status, :null => false
      t.integer :participant_status, :null => false
      t.datetime :last_message_at, :null => false
      t.integer :initiator_deletion_id
      t.integer :participant_deletion_id
      t.timestamps
    end
  end
end
