class Request < ApplicationRecord
  belongs_to :user
  belongs_to :station, foreign_key: 'place_id'
end
