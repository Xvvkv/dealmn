class CreateListings < ActiveRecord::Migration
  def change
    create_table :listings do |t|
      t.references :user
      t.string :title
      t.text :text_description
      t.string :wanted_description

      t.references :item, :polymorphic => true
      
      t.timestamps
    end
  end
end
