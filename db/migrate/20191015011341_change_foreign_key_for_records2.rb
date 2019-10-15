class ChangeForeignKeyForRecords2 < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key :records, column: :place_id

  end

end
