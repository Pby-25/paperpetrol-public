class Station < ApplicationRecord
  has_many :record
  has_many :request
end
