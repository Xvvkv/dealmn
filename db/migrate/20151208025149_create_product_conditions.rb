class CreateProductConditions < ActiveRecord::Migration
  def change
    create_table :product_conditions do |t|
      t.string :title
      t.string :description
      t.timestamps
    end
  end
end
