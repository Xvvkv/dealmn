class AddTosAgreementToUser < ActiveRecord::Migration
  def change
    add_column :users, :tos_agreed_at, :datetime
  end
end
