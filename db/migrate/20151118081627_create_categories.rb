class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.references :parent,  :references => :category
      t.timestamps
    end
  end
end
