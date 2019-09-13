class RemoveNameFromStations < ActiveRecord::Migration[6.0]
  def change
    remove_column :stations, :name
    remove_column :stations, :address
  end
end
