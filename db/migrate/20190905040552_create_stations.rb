class CreateStations < ActiveRecord::Migration[6.0]
  def change
    create_table :stations do |t|
      t.string :name
      t.string :address
      t.string :place_id
      t.datetime :expiry_date

      t.timestamps
    end
    add_index :stations, :place_id
  end
end
