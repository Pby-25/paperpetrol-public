class RefactorRequests < ActiveRecord::Migration[6.0]
  def change
    drop_table :requests
  end
end
