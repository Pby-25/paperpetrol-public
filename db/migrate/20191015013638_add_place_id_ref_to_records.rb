class AddPlaceIdRefToRecords < ActiveRecord::Migration[6.0]
  def change
    add_column :records, :place_id, :string
    add_index :records, :place_id
    # add_reference :records, :station, foreign_key: {to_table: :place_id}, index: true, type: :string
  end
end
