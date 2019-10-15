class RemovePlaceIdFromRecords < ActiveRecord::Migration[6.0]
  def change

    remove_column :records, :place_id
  end
end
