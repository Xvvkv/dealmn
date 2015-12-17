class CreateSpecSuggestions < ActiveRecord::Migration
  def change
    create_table :spec_suggestions do |t|
      t.references :category, :null => false
      t.string :name, :null => false
      t.string :placeholder
      t.timestamps
    end
  end
end
