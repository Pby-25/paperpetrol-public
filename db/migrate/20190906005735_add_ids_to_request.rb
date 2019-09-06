class AddIdsToRequest < ActiveRecord::Migration[6.0]
  def change
    create_table :requests do |t|
      t.integer :user_id
      t.string :place_id
      t.integer :duration

      t.timestamps
    end
    add_index :requests, :user_id
    add_index :requests, :place_id
  end
end
