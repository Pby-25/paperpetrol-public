class AddUserToRequest < ActiveRecord::Migration[6.0]
  def change
    add_reference :requests, :user, foreign_key: true, index: true
  end
end
