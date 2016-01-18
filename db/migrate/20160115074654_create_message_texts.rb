class CreateMessageTexts < ActiveRecord::Migration
  def change
    create_table :message_texts do |t|
      t.references :message, :null => false
      t.integer :direction, :null => false
      t.text :message_text, :null => false
      t.timestamps
    end
  end
end
