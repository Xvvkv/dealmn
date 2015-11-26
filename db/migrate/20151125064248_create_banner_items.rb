class CreateBannerItems < ActiveRecord::Migration
  def change
    create_table :banner_items do |t|
      t.references :banner
      t.attachment :file
      t.datetime :start_date
      t.datetime :end_date
      t.boolean :is_active
      t.timestamps
    end
  end
end
