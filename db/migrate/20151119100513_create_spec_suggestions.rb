class CreateSpecSuggestions < ActiveRecord::Migration
  def change
    create_table :spec_suggestions do |t|
      t.references :category
      t.string :name
      t.timestamps
    end
  end
end