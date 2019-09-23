class Record < ApplicationRecord
  belongs_to :station
  default_scope -> { order(created_at: :desc) }
  has_many :entries

end
