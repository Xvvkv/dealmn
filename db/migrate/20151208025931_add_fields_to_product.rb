class AddFieldsToProduct < ActiveRecord::Migration
  def change
    add_column :products, :product_condition_id, :integer, references: :product_condition
    add_column :products, :condition_description, :string
  end
end
