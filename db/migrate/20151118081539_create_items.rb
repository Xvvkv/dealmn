class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string :title
      t.text :text_description
      t.string :wanted_description

      t.references :itemable, :polymorphic => true
      t.references :listing
      t.references :primary_image, references: :image
      t.timestamps
    end
  end
end
