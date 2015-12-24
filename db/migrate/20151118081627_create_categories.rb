class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :name, :null => false, :default => ""
      t.boolean :is_active, :null => false, :default => true
      t.integer :column_num
      t.integer :column_order
      t.references :parent,  :references => :category
      t.timestamps
    end
  end
end
