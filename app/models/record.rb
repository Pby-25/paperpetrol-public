class Record < ApplicationRecord
  belongs_to :station
  has_many :entries

end
