class Record < ApplicationRecord
  belongs_to :station, foreign_key: 'place_id', primary_key: 'place_id'
  default_scope -> { order(created_at: :desc) }
  has_many :entries

end
