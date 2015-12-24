class CreateSpecs < ActiveRecord::Migration
  def change
    create_table :specs do |t|
      t.references :listing, :null => false
      t.string :name, :null => false
      t.string :value, :null => false
      t.timestamps
    end
    add_index :specs, [:listing_id,:name], :unique => true
  end
end
