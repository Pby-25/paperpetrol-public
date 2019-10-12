class ChangeEntries < ActiveRecord::Migration[6.0]

  def up
    change_column :entries, :price, :string
  end

  def down
    change_column :entries, :price, :decimal
  end

end