class AddIndexToUser < ActiveRecord::Migration[6.0]
  def change
    add_index :users, :email, unique: true
    add_column :users, :remember_digest, :string
    add_column :users, :activation_digest, :string
    add_column :users, :activated, :boolean, default: false
    add_column :users, :activated_at, :datetime
    add_column :users, :reset_digest, :string
    add_column :users, :reset_sent_at, :datetime
  end
end
