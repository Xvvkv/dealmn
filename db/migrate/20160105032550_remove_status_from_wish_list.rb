class RemoveStatusFromWishList < ActiveRecord::Migration
  def change
    remove_column :wish_lists, :status
  end
end
