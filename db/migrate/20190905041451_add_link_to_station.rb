class AddLinkToStation < ActiveRecord::Migration[6.0]
  def change
    add_column :stations, :link, :string
  end
end
