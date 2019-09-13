class AddNicknameToRequests < ActiveRecord::Migration[6.0]
  def change
    add_column :requests, :nickname, :string
    add_index :requests, [:user_id, :place_id], unique: true
  end
end
