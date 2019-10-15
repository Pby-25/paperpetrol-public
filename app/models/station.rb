class Station < ApplicationRecord
  self.primary_key = "place_id"
  has_many :records, foreign_key: 'place_id'
  has_many :requests
end
