class CreateSpecs < ActiveRecord::Migration
  def change
    create_table :specs do |t|
      t.references :listing
      t.string :name
      t.string :value
      t.timestamps
    end
  end
end
