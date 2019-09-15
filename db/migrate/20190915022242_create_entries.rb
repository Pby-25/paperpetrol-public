class CreateEntries < ActiveRecord::Migration[6.0]
  def change
    create_table :entries do |t|
      t.decimal :price
      t.string :grade
      t.references :record, foreign_key: true, index:true
    end
  end
end
