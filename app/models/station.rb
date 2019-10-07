class Station < ApplicationRecord
  self.primary_key = "place_id"
  has_many :record
  has_many :request
end
