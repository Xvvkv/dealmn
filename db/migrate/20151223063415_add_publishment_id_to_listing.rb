class AddPublishmentIdToListing < ActiveRecord::Migration
  def up
    add_column :listings, :publishment_id, :integer
    add_index :listings, :publishment_id, :unique => true
    execute "CREATE SEQUENCE publishment_seq START 10001"
  end

  def down
    execute "DROP SEQUENCE publishment_seq"
    remove_index :listings, :publishment_id
    remove_column :listings, :publishment_id
  end
end
