class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :name
      t.boolean :is_active
      t.integer :position_order
      t.references :parent,  :references => :category
      t.timestamps
    end
  end
end
