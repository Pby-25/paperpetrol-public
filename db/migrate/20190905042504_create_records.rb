class CreateRecords < ActiveRecord::Migration[6.0]
  def change
    create_table :records do |t|
      t.string :rating, array: true
      t.decimal :price, array: true
      t.references :station, foreign_key: true, index:true

      t.timestamps
    end
  end
end
