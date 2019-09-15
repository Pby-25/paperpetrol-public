class RemoveArrayFromRecords < ActiveRecord::Migration[6.0]
  def change

    remove_column :records, :rating, :string

    remove_column :records, :price, :decimal
  end
end
