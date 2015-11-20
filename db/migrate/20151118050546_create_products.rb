class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|
      t.integer :condition
      t.string :condition_description
      
      t.timestamps
    end
  end
end
