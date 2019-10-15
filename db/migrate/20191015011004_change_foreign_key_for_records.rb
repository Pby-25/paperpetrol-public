class ChangeForeignKeyForRecords < ActiveRecord::Migration[6.0]
  def change
    rename_column :records, :station_id, :place_id
  end
end
